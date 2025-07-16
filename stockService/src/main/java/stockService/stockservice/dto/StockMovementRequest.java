package stockService.stockservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import stockService.stockservice.Entity.MovementType;

public class StockMovementRequest {

    @NotNull(message = "Stock ID is required")
    private Long stockId;

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Movement type is required")
    private MovementType movementType;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    @NotNull(message = "Stock Manager ID is required")
    private Long stockManagerId;

    private Long customerId;   // New: Optional for sales
    private Long supplierId;   // New: Optional for purchases
    private boolean isPaid;    // New: Track payment status

    public StockMovementRequest() {}

    public StockMovementRequest(Long stockId, Long productId, MovementType movementType, int quantity, Long stockManagerId, Long customerId, Long supplierId, boolean isPaid) {
        this.stockId = stockId;
        this.productId = productId;
        this.movementType = movementType;
        this.quantity = quantity;
        this.stockManagerId = stockManagerId;
        this.customerId = customerId;
        this.supplierId = supplierId;
        this.isPaid = isPaid;
    }

    public Long getStockId() {
        return stockId;
    }

    public void setStockId(Long stockId) {
        this.stockId = stockId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public MovementType getMovementType() {
        return movementType;
    }

    public void setMovementType(MovementType movementType) {
        this.movementType = movementType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Long getStockManagerId() {
        return stockManagerId;
    }

    public void setStockManagerId(Long stockManagerId) {
        this.stockManagerId = stockManagerId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public boolean isPaid() {
        return isPaid;
    }

    public void setPaid(boolean paid) {
        isPaid = paid;
    }
}
