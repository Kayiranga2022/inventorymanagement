package stockService.stockservice.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stockService.stockservice.Entity.*;

import java.util.Optional;

@Repository
public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {

    // Fetch stock history for a specific stock with pagination
    Page<StockHistory> findByStock(Stock stock, Pageable pageable);

    // Fetch stock history by change type with pagination
    Page<StockHistory> findByChangeType(StockHistory.ChangeType changeType, Pageable pageable);

    // Fetch stock history by stock manager with pagination
    Page<StockHistory> findByStockManager(StockManager stockManager, Pageable pageable);

    // Fetch stock history by product ID with pagination
    Page<StockHistory> findByProductId(Long productId, Pageable pageable);

    Optional<StockHistory> findById(Long id);

    Page<StockHistory> findByStockTransaction(StockTransaction stockTransaction, Pageable pageable);
}