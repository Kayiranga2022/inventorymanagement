package stockService.stockservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StockDTO {
    private Long id;
    private String sku;
    private String name;
    private String supplier;
    private int quantity;
    private double price; // Added price field
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate doneAt;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expirationDate;
    private Long productId;
    private String productName;
}