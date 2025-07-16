package stockService.stockservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.StockManager;
import stockService.stockservice.Service.StockManagerService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/stock-managers")
public class StockManagerController {

    private static final Logger logger = LoggerFactory.getLogger(StockManagerController.class);

    private final StockManagerService stockManagerService;

    public StockManagerController(StockManagerService stockManagerService) {
        this.stockManagerService = stockManagerService;
    }

    @PostMapping("/add")
    public ResponseEntity<StockManager> createStockManager(@RequestBody StockManager stockManager, Authentication authentication) {
        logger.info("Authenticated user for createStockManager: {}", authentication);
        return ResponseEntity.ok(stockManagerService.saveStockManager(stockManager));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockManager> getStockManagerById(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for getStockManagerById: {}", authentication);
        return stockManagerService.getStockManagerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StockManager> updateStockManager(@PathVariable Long id, @RequestBody StockManager updatedStockManager, Authentication authentication) {
        logger.info("Authenticated user for updateStockManager: {}", authentication);
        return stockManagerService.updateStockManager(id, updatedStockManager)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<StockManager> getStockManagerByEmail(@PathVariable String email, Authentication authentication) {
        logger.info("Authenticated user for getStockManagerByEmail: {}", authentication);
        return stockManagerService.getStockManagerByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<List<StockManager>> getAllStockManagers(Authentication authentication) {
        logger.info("Authenticated user for getAllStockManagers: {}", authentication);
        return ResponseEntity.ok(stockManagerService.getAllStockManagers());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStockManager(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for deleteStockManager: {}", authentication);
        stockManagerService.deleteStockManager(id);
        return ResponseEntity.ok("Stock Manager deleted successfully");
    }
}