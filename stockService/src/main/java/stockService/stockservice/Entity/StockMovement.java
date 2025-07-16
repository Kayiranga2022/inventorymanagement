// StockMovement.java (Entity)
package stockService.stockservice.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "stock_movement")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType movementType;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "stock_manager_id", nullable = false)
    private StockManager stockManager;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = true)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = true)
    private Supplier supplier;

    @Column(name = "is_paid", nullable = false)
    private boolean isPaid;

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
    }
}
