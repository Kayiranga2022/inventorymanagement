package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import stockService.stockservice.Entity.ExpiredStock;
import stockService.stockservice.Entity.Stock;
//import stockService.stockservice.Entity.ExpiredStock;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpiredStockRepository extends JpaRepository<ExpiredStock, Long> {

    // Example custom query to find expired stocks by a specific expiration date
    @Query("SELECT e FROM ExpiredStock e WHERE e.expirationDate = ?1")
    List<ExpiredStock> findByExpirationDate(LocalDate expirationDate);
    List<Stock> findByExpirationDateLessThanEqual(LocalDate expirationDate);
}
