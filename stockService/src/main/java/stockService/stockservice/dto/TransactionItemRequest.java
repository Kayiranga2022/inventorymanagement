package stockService.stockservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@Setter
@ToString
public class TransactionItemRequest {
    @NotNull(message = "Stock ID is required")
    private Long stockId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    @NotNull(message = "Price must be non-negative")
    private BigDecimal pricePerUnit;
}