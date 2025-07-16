package stockService.stockservice.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class StockMovementReportRequest {

    private Long stockId;
    private String movementType; // Will be converted to enum in service
    private LocalDate startDate;
    private LocalDate endDate;

    // Getters and Setters
    public Long getStockId() {
        return stockId;
    }

    public void setStockId(Long stockId) {
        this.stockId = stockId;
    }

    public String getMovementType() {
        return movementType;
    }

    public void setMovementType(String movementType) {
        this.movementType = movementType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    // Helper Methods to Convert LocalDate to LocalDateTime
    public LocalDateTime getStartDateTime() {
        return startDate != null ? startDate.atStartOfDay() : LocalDateTime.of(2000, 1, 1, 0, 0); // Default past date
    }

    public LocalDateTime getEndDateTime() {
        return endDate != null ? endDate.atTime(23, 59, 59) : LocalDateTime.now(); // Default to current time
    }
}
