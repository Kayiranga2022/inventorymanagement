package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import stockService.stockservice.Entity.StockManager;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockManagerRepository extends JpaRepository<StockManager, Long> {
    Optional<StockManager> findByEmail(String email);
    Optional<StockManager> findByUsername(String username);
    List<StockManager> findAll();  // Fetch all managers

    // Custom JPQL query to fetch all emails
    @Query("SELECT s.email FROM StockManager s")
    List<String> findAllEmails();
}
