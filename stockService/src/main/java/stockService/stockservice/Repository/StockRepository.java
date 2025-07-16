package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import stockService.stockservice.Entity.Stock;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByExpirationDate(LocalDate expirationDate);

    // Corrected countByQuantityLessThanThreshold
    @Query("SELECT COUNT(s) FROM Stock s WHERE s.quantity < s.product.minStockThreshold")
    Long countByQuantityLessThanThreshold();

    List<Stock> findByProductId(Long productId);

    Optional<Stock> findBySku(String sku);

    List<Stock> findBySupplier(String supplier);

    Long countByExpirationDateLessThanEqual(LocalDate expirationDate);

    @Query("SELECT s FROM Stock s JOIN FETCH s.product")
    List<Stock> findAllWithProducts();

    // Corrected getStockTrendsDataNative
    @Query(value = "SELECT DATE_FORMAT(s.done_at, '%Y-%m') as month, SUM(s.quantity) as totalStock " +
            "FROM Stock s " +
            "GROUP BY month " +
            "ORDER BY month", nativeQuery = true)
    List<Object[]> getStockTrendsDataNative();

    // Corrected getStockTrendsData
    default Map<String, List<Integer>> getStockTrendsData() {
        List<Object[]> results = getStockTrendsDataNative();
        return results.stream().collect(Collectors.toMap(
                result -> (String) result[0],
                result -> List.of(((Number) result[1]).intValue())
        ));
    }
    @Query("SELECT s FROM Stock s JOIN FETCH s.product WHERE s.quantity < s.product.minStockThreshold")

    List<Stock> findByQuantityLessThanThreshold();
    //Removed findByQuantityLessThanThreshold. it is not used by the service.
    List<Stock> findByExpirationDateLessThanEqual(LocalDate expirationDate);
}