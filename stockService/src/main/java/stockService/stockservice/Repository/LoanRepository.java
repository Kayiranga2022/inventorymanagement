package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stockService.stockservice.Entity.Loan;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
}