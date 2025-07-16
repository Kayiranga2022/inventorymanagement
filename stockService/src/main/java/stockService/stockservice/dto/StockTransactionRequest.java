package stockService.stockservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import stockService.stockservice.Entity.MovementType;
import stockService.stockservice.Entity.PaymentMethod;
import stockService.stockservice.Entity.PaymentStatus;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StockTransactionRequest {
    @NotNull(message = "Movement type cannot be null")
    private MovementType movementType;

    private Long supplierId;

    private Long customerId;

    @NotNull(message = "Stock manager ID cannot be null")
    @Min(value = 1, message = "Stock manager ID must be greater than 0")
    private Long stockManagerId;

    @NotNull(message = "Payment method cannot be null")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Payment status cannot be null")
    private PaymentStatus paymentStatus;

    @NotNull(message = "Items list cannot be null")
    @Valid
    private List<TransactionItemRequest> items;

    @NotNull(message = "Amount paid cannot be null")
    private BigDecimal amountPaid;
}