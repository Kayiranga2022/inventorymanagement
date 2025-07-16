package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stockService.stockservice.Entity.Supplier;

import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByPhone(String phone);
    Optional<Supplier> findByEmail(String email);
}
