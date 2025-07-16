package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stockService.stockservice.Entity.Product;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
}