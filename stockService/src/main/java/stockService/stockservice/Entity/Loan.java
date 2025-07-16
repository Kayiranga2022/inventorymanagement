package stockService.stockservice.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanType loanType;


    @ManyToOne
    @JoinColumn(name = "entity_id", nullable = false)
    private BaseLoanEntity entity; // Using AbstractLoanEntity

    @Column(nullable = false)
    private BigDecimal loanAmount;

    @Column(nullable = false)
    private BigDecimal outstandingAmount;

    @Column(nullable = false)
    private LocalDateTime loanDate;

    private LocalDateTime dueDate;

    private String notes;

    @OneToOne
    @JoinColumn(name = "transaction_id", nullable = false)
    private StockTransaction transaction;

    public enum LoanType {
        CUSTOMER_LOAN, SUPPLIER_LOAN
    }
}