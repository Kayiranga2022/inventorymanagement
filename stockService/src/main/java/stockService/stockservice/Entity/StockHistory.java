package stockService.stockservice.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "stock_history")
public class StockHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "change_type", nullable = false)
    private ChangeType changeType;

    @Column(name = "quantity_change", nullable = false)
    private int quantityChange;

    @Column(name = "previous_quantity", nullable = false)
    private int previousQuantity;

    @Column(name = "new_quantity", nullable = false)
    private int newQuantity;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "stock_manager_id", nullable = false)
    private StockManager stockManager;

    @ManyToOne
    @JoinColumn(name = "stock_transaction_id")
    private StockTransaction stockTransaction;

    @Column(name = "notes")
    private String notes;

    @Column(name = "reference_id")
    private Long referenceId;

    @PrePersist
    public void prePersist() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }

    public enum ChangeType {
        ADDITION, REDUCTION, ADJUSTMENT
    }
}