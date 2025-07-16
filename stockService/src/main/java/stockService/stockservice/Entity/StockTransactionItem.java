package stockService.stockservice.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "stock_transaction_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockTransactionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "stock_transaction_id", nullable = false)
    @JsonIgnore
    private StockTransaction stockTransaction;

    @ManyToOne
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private BigDecimal pricePerUnit;

    public BigDecimal getTotalPrice() {
        return pricePerUnit.multiply(BigDecimal.valueOf(quantity));
    }
}