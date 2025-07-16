package stockService.stockservice.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "stock_transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType movementType;

    @Column(nullable = false, unique = true)
    private String referenceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", insertable = false, updatable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "customer_id")
    private Long customerId;

    @ManyToOne
    @JoinColumn(name = "stock_manager_id", nullable = false)
    private StockManager stockManager;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @OneToMany(mappedBy = "stockTransaction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StockTransactionItem> items = new ArrayList<>();

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private BigDecimal amountPaid;

    // New fields for session data
    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "session_start_time")
    private LocalDateTime sessionStartTime;

    @Column(name = "session_end_time")
    private LocalDateTime sessionEndTime;

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
        this.referenceNumber = "TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public BigDecimal calculateTotalAmount() {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return items.stream()
                .map(item -> item.getPricePerUnit().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}