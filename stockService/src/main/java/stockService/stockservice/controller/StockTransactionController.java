// StockTransactionController.java
package stockService.stockservice.controller;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.MovementType;
import stockService.stockservice.Entity.PaymentStatus;
import stockService.stockservice.Entity.StockTransaction;
import stockService.stockservice.Service.StockTransactionService;
import stockService.stockservice.dto.StockTransactionRequest;
import stockService.stockservice.dto.TransactionFilterRequest;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Validated
public class StockTransactionController {

    private static final Logger logger = LoggerFactory.getLogger(StockTransactionController.class);

    private final StockTransactionService stockTransactionService;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    @PostMapping
    public ResponseEntity<StockTransaction> createTransaction(@Valid @RequestBody StockTransactionRequest request, Authentication authentication) {
        logger.info("Authenticated user for createTransaction: {}", authentication);
        logger.info("Received StockTransactionRequest: {}", request);
        logger.debug("Received StockTransactionRequest Items: {}", request.getItems());

        try {
            StockTransaction transaction = stockTransactionService.createTransaction(request);
            logger.info("Transaction created with ID: {}", transaction.getId());
            return ResponseEntity.ok(transaction);
        } catch (ResponseStatusException e) {
            logger.error("Error creating transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(e.getStatusCode()).body(null);
        } catch (Exception e) {
            logger.error("Unexpected error creating transaction: {}", e.getMessage(), e);
            logger.error("Stack trace:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<StockTransaction>> getFilteredTransactions(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String movementType,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long sessionId,
            @RequestParam(required = false) String sessionStartTime,
            @RequestParam(required = false) String sessionEndTime,
            Authentication authentication
    ) {
        logger.info("Authenticated user for getFilteredTransactions: {}", authentication);
        logger.info("Received Request: startDate={}, endDate={}, movementType={}, paymentStatus={}, supplierId={}, customerId={}, productId={}, sessionId={}, sessionStartTime={}, sessionEndTime={}",
                startDate, endDate, movementType, paymentStatus, supplierId, customerId, productId, sessionId, sessionStartTime, sessionEndTime);

        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        LocalDateTime sessionStartTimeDateTime = parseDateTime(sessionStartTime);
        LocalDateTime sessionEndTimeDateTime = parseDateTime(sessionEndTime);

        logger.debug("Parsed startDateTime: {}", startDateTime);
        logger.debug("Parsed endDateTime: {}", endDateTime);
        logger.debug("Parsed sessionStartTimeDateTime: {}", sessionStartTimeDateTime);
        logger.debug("Parsed sessionEndTimeDateTime: {}", sessionEndTimeDateTime);

        try {
            Optional<MovementType> movementTypeEnum = Optional.ofNullable(movementType).map(MovementType::valueOf);
            Optional<PaymentStatus> paymentStatusEnum = Optional.ofNullable(paymentStatus).map(PaymentStatus::valueOf);

            TransactionFilterRequest filterRequest = new TransactionFilterRequest(
                    startDateTime, endDateTime,
                    movementTypeEnum.orElse(null),
                    paymentStatusEnum.orElse(null),
                    supplierId, customerId, productId,
                    sessionId, sessionStartTimeDateTime, sessionEndTimeDateTime
            );

            List<StockTransaction> transactions = stockTransactionService.getFilteredTransactions(filterRequest).stream()
                    .collect(Collectors.toList());

            return ResponseEntity.ok(transactions);

        } catch (IllegalArgumentException e) {
            logger.error("Invalid Enum Value: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    private LocalDateTime parseDateTime(String date) {
        if (date == null || date.trim().isEmpty()) {
            return null;
        }

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ISO_DATE_TIME;
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            return date.contains("T") ?
                    LocalDateTime.parse(date, dateTimeFormatter) :
                    LocalDate.parse(date, dateFormatter).atStartOfDay();
        } catch (DateTimeParseException e) {
            try {
                return LocalDate.parse(date, dateFormatter).atTime(23, 59, 59);
            } catch (DateTimeParseException e2) {
                logger.error("Date Parsing Error: Invalid date format: {}", date);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format: " + date);
            }
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockTransaction> getTransactionById(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for getTransactionById: {}", authentication);
        Optional<StockTransaction> transaction = stockTransactionService.getTransactionById(id);
        if (transaction.isPresent()) {
            logger.info("Transaction found with ID: {}", id);
            return ResponseEntity.ok(transaction.get());
        } else {
            logger.info("Transaction not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .reduce("", (acc, error) -> acc + error + "\n");
        return ResponseEntity.badRequest().body(errorMessage);
    }
    @GetMapping("/chart-data")
    public ResponseEntity<Map<String, Object>> getTransactionChartData(Authentication authentication) {
        logger.info("Authenticated user for getTransactionChartData: {}", authentication);

        List<StockTransaction> transactions = stockTransactionService.getAllTransactions(); // You might need to implement this in your service

        Map<YearMonth, Map<MovementType, Integer>> monthlyMovementCounts = new HashMap<>();

        for (StockTransaction transaction : transactions) {
            YearMonth yearMonth = YearMonth.from(transaction.getTimestamp());
            MovementType movementType = transaction.getMovementType();

            monthlyMovementCounts.computeIfAbsent(yearMonth, k -> new HashMap<>())
                    .merge(movementType, 1, Integer::sum);
        }

        List<String> labels = new ArrayList<>();
        Map<MovementType, List<Integer>> datasets = new HashMap<>();

        for (YearMonth yearMonth : monthlyMovementCounts.keySet().stream().sorted().collect(Collectors.toList())) {
            labels.add(yearMonth.toString());

            for (MovementType movementType : MovementType.values()) {
                datasets.computeIfAbsent(movementType, k -> new ArrayList<>())
                        .add(monthlyMovementCounts.get(yearMonth).getOrDefault(movementType, 0));
            }
        }

        Map<String, Object> chartData = new HashMap<>();
        chartData.put("labels", labels);

        List<Map<String, Object>> datasetsList = new ArrayList<>();
        for (MovementType movementType : MovementType.values()) {
            Map<String, Object> dataset = new HashMap<>();
            dataset.put("label", movementType.toString());
            dataset.put("data", datasets.get(movementType));
            dataset.put("backgroundColor", getColorForMovementType(movementType));
            dataset.put("borderColor", getBorderColorForMovementType(movementType));
            datasetsList.add(dataset);
        }

        chartData.put("datasets", datasetsList);

        return ResponseEntity.ok(chartData);
    }

    private String getColorForMovementType(MovementType movementType) {
        return switch (movementType) {
            case PURCHASE -> "rgba(54, 162, 235, 0.5)"; // Blue
            case SALE -> "rgba(255, 99, 132, 0.5)"; // Red
            case TRANSFER -> "rgba(255, 206, 86, 0.5)"; // Yellow
            case RETURN -> "rgba(75, 192, 192, 0.5)"; // Green
        };
    }

    private String getBorderColorForMovementType(MovementType movementType) {
        return switch (movementType) {
            case PURCHASE -> "rgba(54, 162, 235, 1)";
            case SALE -> "rgba(255, 99, 132, 1)";
            case TRANSFER -> "rgba(255, 206, 86, 1)";
            case RETURN -> "rgba(75, 192, 192, 1)";
        };
    }

}