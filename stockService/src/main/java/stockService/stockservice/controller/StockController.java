package stockService.stockservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.Stock;
import stockService.stockservice.Service.StockService;
import stockService.stockservice.dto.StockDTO;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private static final Logger logger = LoggerFactory.getLogger(StockController.class);

    @Autowired
    private StockService stockService;

    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @PostMapping("/save/{productId}")
    public ResponseEntity<?> addStock(@PathVariable Long productId, @RequestBody Stock stock, Authentication authentication) {
        logger.info("Authenticated user for addStock: {}", authentication);
        try {
            return ResponseEntity.ok(stockService.addStock(productId, stock));
        } catch (NoSuchElementException e) {
            logger.error("Product not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error adding stock: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<StockDTO>> getAllStocks(Authentication authentication) {
        logger.info("Authenticated user for getAllStocks: {}", authentication);
        List<StockDTO> stocks = stockService.getAllStocks();
        logger.info("Stocks returned from service: {}", stocks);
        logger.info("Stocks returned to the frontend: {}", stocks);
        return ResponseEntity.ok(stocks);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/sku/{sku}")
    public ResponseEntity<?> getStockBySku(@PathVariable String sku, Authentication authentication) {
        logger.info("Authenticated user for getStockBySku: {}", authentication);
        try {
            return ResponseEntity.ok(stockService.getStockBySku(sku));
        } catch (NoSuchElementException e) {
            logger.error("Stock not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error getting stock: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/supplier/{supplier}")
    public ResponseEntity<List<Stock>> getStocksBySupplier(@PathVariable String supplier, Authentication authentication) {
        logger.info("Authenticated user for getStocksBySupplier: {}", authentication);
        return ResponseEntity.ok(stockService.getStocksBySupplier(supplier));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody Stock stock, Authentication authentication) {
        logger.info("Authenticated user for updateStock: {}", authentication);
        try {
            return ResponseEntity.ok(stockService.updateStock(id, stock));
        } catch (NoSuchElementException e) {
            logger.error("Stock not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating stock: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for deleteStock: {}", authentication);
        try {
            stockService.deleteStock(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            logger.error("Stock not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            logger.error("Error deleting stock: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalStockCount(Authentication authentication) {
        logger.info("Authenticated user for getTotalStockCount: {}", authentication);
        return ResponseEntity.ok(stockService.getTotalStockCount());
    }

    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/low")
    public ResponseEntity<Long> getLowStockAlertsCount(Authentication authentication) {
        logger.info("Authenticated user for getLowStockAlertsCount: {}", authentication);      return ResponseEntity.ok(stockService.getLowStockAlertsCount());
    }

    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/expired")
    public ResponseEntity<Long> getExpiredStockCount(Authentication authentication) {
        logger.info("Authenticated user for getExpiredStockCount: {}", authentication);
        return ResponseEntity.ok(stockService.getExpiredStockCount());
    }

    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/trends")
    public ResponseEntity<Map<String, List<Integer>>> getStockTrends(Authentication authentication) {
        logger.info("Authenticated user for getStockTrends: {}", authentication);
        return ResponseEntity.ok(stockService.getStockTrends());
    }
}