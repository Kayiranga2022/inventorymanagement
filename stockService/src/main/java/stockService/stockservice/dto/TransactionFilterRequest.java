package stockService.stockservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import stockService.stockservice.Entity.MovementType;
import stockService.stockservice.Entity.PaymentStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionFilterRequest {
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private MovementType movementType;
    private PaymentStatus paymentStatus;
    private Long supplierId;
    private Long customerId;
    private Long productId;
    private Long sessionId; // Added session ID filter
    private LocalDateTime sessionStartTime; //Added session start time filter
    private LocalDateTime sessionEndTime; //Added session end time filter
}