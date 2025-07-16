package stockService.stockservice.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "expired_stock")
public class ExpiredStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;  // Associate expired stock with a product

    private BigDecimal price; // changed to BigDecimal
    private Integer quantity;
    private LocalDate expirationDate;

    // Constructor
    public ExpiredStock(Product product, BigDecimal price, Integer quantity, LocalDate expirationDate) {
        this.product = product;
        this.price = price;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
    }
}