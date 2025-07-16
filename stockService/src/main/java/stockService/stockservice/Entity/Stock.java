package stockService.stockservice.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "stock")
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku", nullable = false, unique = true)
    private String sku;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "supplier", nullable = false)
    private String supplier;

    private int quantity;

    @Column(name = "price", nullable = false) // Added price field
    private double price;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "done_at")
    private LocalDate doneAt;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public Stock(Product product, String name, String sku, Integer quantity, LocalDate expirationDate, String supplier, double price) {
        this.product = product;
        this.name = name;
        this.sku = sku;
        this.quantity = quantity;
        this.supplier = supplier;
        this.expirationDate = expirationDate;
        this.doneAt = LocalDate.now();
        this.price = price; // Initialize the price
    }
}