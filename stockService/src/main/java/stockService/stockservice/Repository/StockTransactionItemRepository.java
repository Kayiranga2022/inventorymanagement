// StockTransactionItemRepository.java
package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stockService.stockservice.Entity.StockTransactionItem;

import java.util.List;

public interface StockTransactionItemRepository extends JpaRepository<StockTransactionItem, Long> {
    // If you remove productId from StockTransactionItem, remove this method
    //List<StockTransactionItem> findByProductId(Long productId);
}