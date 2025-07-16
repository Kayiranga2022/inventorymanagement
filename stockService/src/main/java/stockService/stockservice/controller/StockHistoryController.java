package stockService.stockservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.StockHistory;
import stockService.stockservice.Service.StockHistoryService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/stock-history")
public class StockHistoryController {

    private static final Logger logger = LoggerFactory.getLogger(StockHistoryController.class);

    @Autowired
    private StockHistoryService stockHistoryService;

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Page<StockHistory>> getAllStockHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        logger.info("Authenticated user for getAllStockHistory: {}", authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<StockHistory> history = stockHistoryService.getAllStockHistory(pageable);
        return ResponseEntity.ok(history);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<StockHistory> getStockHistoryById(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for getStockHistoryById: {}", authentication);
        StockHistory stockHistory = stockHistoryService.getStockHistoryById(id);

        if (stockHistory == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(stockHistory);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/stock/{stockId}")
    public ResponseEntity<Page<StockHistory>> getStockHistoryByStock(
            @PathVariable Long stockId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        logger.info("Authenticated user for getStockHistoryByStock: {}", authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<StockHistory> history = stockHistoryService.getStockHistoryByStock(stockId, pageable);
        return ResponseEntity.ok(history);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/change-type/{changeType}")
    public ResponseEntity<Page<StockHistory>> getStockHistoryByChangeType(
            @PathVariable String changeType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        logger.info("Authenticated user for getStockHistoryByChangeType: {}", authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<StockHistory> history = stockHistoryService.getStockHistoryByChangeType(changeType, pageable);
        return ResponseEntity.ok(history);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<StockHistory>> getStockHistoryByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        logger.info("Authenticated user for getStockHistoryByUser: {}", authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<StockHistory> history = stockHistoryService.getStockHistoryByUser(userId, pageable);
        return ResponseEntity.ok(history);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<StockHistory>> getStockHistoryByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        logger.info("Authenticated user for getStockHistoryByProduct: {}", authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<StockHistory> history = stockHistoryService.getStockHistoryByProduct(productId, pageable);
        if (history == null || history.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(history);
    }
}