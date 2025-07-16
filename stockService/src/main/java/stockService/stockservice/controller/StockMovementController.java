/* package stockService.stockservice.controller;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.StockMovement;
import stockService.stockservice.Service.StockMovementReportService;
import stockService.stockservice.Service.StockMovementService;
import stockService.stockservice.dto.StockMovementRequest;
import stockService.stockservice.dto.StockMovementReportRequest;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@Validated
@RequestMapping("/api/stock-movements")
public class StockMovementController {

    private static final Logger logger = LoggerFactory.getLogger(StockMovementController.class);

    @Autowired
    private StockMovementService stockMovementService;

    @Autowired
    private StockMovementReportService stockMovementReportService;

    @GetMapping("/all")
    public List<StockMovement> getAllStockMovements(Authentication authentication) {
        logger.info("Authenticated user for getAllStockMovements: {}", authentication);
        return stockMovementService.getAllStockMovements();
    }

    @GetMapping("/{stockId}")
    public List<StockMovement> getStockMovements(@PathVariable Long stockId, Authentication authentication) {
        logger.info("Authenticated user for getStockMovements: {}", authentication);
        return stockMovementService.getStockMovementsByStockId(stockId);
    }

    @GetMapping("/movement/{id}")
    public ResponseEntity<StockMovement> getStockMovementById(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for getStockMovementById: {}", authentication);
        Optional<StockMovement> stockMovement = stockMovementService.getStockMovementById(id);

        return stockMovement.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<?> createStockMovement(@Valid @RequestBody StockMovementRequest request, Authentication authentication) {
        logger.info("Authenticated user for createStockMovement: {}", authentication);
        try {
            StockMovement stockMovement = stockMovementService.logStockMovement(
                    request.getStockId(),
                    request.getMovementType(),
                    request.getQuantity(),
                    request.getStockManagerId(),
                    request.getCustomerId(),
                    request.getSupplierId(),
                    request.isPaid()
            );
            return ResponseEntity.ok(stockMovement);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Error creating stock movement: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("An unexpected error occurred.");
        }
    }

    @PostMapping("/report/pdf")
    public ResponseEntity<byte[]> generateStockMovementReport(@RequestBody StockMovementReportRequest request, Authentication authentication) {
        logger.info("Authenticated user for generateStockMovementReport: {}", authentication);
        byte[] pdfData = stockMovementReportService.generateStockMovementReport(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stock_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfData);
    }

    @PostMapping("/downloadReport")
    public ResponseEntity<byte[]> downloadStockMovementReport(@Valid @RequestBody StockMovementReportRequest request, Authentication authentication) {
        logger.info("Authenticated user for downloadStockMovementReport: {}", authentication);
        byte[] report = stockMovementReportService.generateStockMovementReport(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stock_movement_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(report);
    }
}

8/
 */
package stockService.stockservice.controller;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.StockMovement;
import stockService.stockservice.Service.StockMovementReportService;
import stockService.stockservice.dto.StockMovementReportRequest;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@Validated
@RequestMapping("/api/stock-movements")
public class StockMovementController {

    private static final Logger logger = LoggerFactory.getLogger(StockMovementController.class);

    @Autowired
    private StockMovementReportService stockMovementReportService;

    @GetMapping("/all")
    public List<StockMovement> getAllStockMovements(Authentication authentication) {
        logger.info("Authenticated user for getAllStockMovements: {}", authentication);
        return stockMovementReportService.getAllStockMovements();
    }

    @GetMapping("/{stockId}")
    public List<StockMovement> getStockMovements(@PathVariable Long stockId, Authentication authentication) {
        logger.info("Authenticated user for getStockMovements: {}", authentication);
        return stockMovementReportService.getStockMovementsByStockId(stockId);
    }

    @GetMapping("/movement/{id}")
    public ResponseEntity<StockMovement> getStockMovementById(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for getStockMovementById: {}", authentication);
        Optional<StockMovement> stockMovement = stockMovementReportService.getStockMovementById(id);

        return stockMovement.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/report/pdf")
    public ResponseEntity<byte[]> generateStockMovementReport(@RequestBody StockMovementReportRequest request, Authentication authentication) {
        logger.info("Authenticated user for generateStockMovementReport: {}", authentication);
        byte[] pdfData = stockMovementReportService.generateStockMovementReport(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stock_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfData);
    }

    @PostMapping("/downloadReport")
    public ResponseEntity<byte[]> downloadStockMovementReport(@Valid @RequestBody StockMovementReportRequest request, Authentication authentication) {
        logger.info("Authenticated user for downloadStockMovementReport: {}", authentication);
        byte[] report = stockMovementReportService.generateStockMovementReport(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stock_movement_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(report);
    }
}