package stockService.stockservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stockService.stockservice.Entity.*;
import stockService.stockservice.Repository.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StockHistoryService {

    private final StockHistoryRepository stockHistoryRepository;
    private final StockRepository stockRepository;
    private final StockManagerRepository stockManagerRepository;
    private final ProductRepository productRepository;
    private final StockTransactionRepository stockTransactionRepository;

    @Autowired
    public StockHistoryService(StockHistoryRepository stockHistoryRepository, StockRepository stockRepository, StockManagerRepository stockManagerRepository, ProductRepository productRepository, StockTransactionRepository stockTransactionRepository) {
        this.stockHistoryRepository = stockHistoryRepository;
        this.stockRepository = stockRepository;
        this.stockManagerRepository = stockManagerRepository;
        this.productRepository = productRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }

    // Fetch all stock history records with pagination
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Page<StockHistory> getAllStockHistory(Pageable pageable) {
        return stockHistoryRepository.findAll(pageable);
    }

    // Fetch stock history for a specific stock with pagination
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Page<StockHistory> getStockHistoryByStock(Long stockId, Pageable pageable) {
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock not found"));
        return stockHistoryRepository.findByStock(stock, pageable);
    }

    // Fetch stock history by change type (purchase, sale, transfer, return) with pagination
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Page<StockHistory> getStockHistoryByChangeType(String changeType, Pageable pageable) {
        StockHistory.ChangeType enumChangeType;
        try {
            enumChangeType = StockHistory.ChangeType.valueOf(changeType);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Change Type");
        }
        return stockHistoryRepository.findByChangeType(enumChangeType, pageable);
    }

    // Fetch stock history by user ID with pagination
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Page<StockHistory> getStockHistoryByUser(Long userId, Pageable pageable) {
        StockManager stockManager = stockManagerRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock Manager not found"));
        return stockHistoryRepository.findByStockManager(stockManager, pageable);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Page<StockHistory> getStockHistoryByProduct(Long productId, Pageable pageable) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return stockHistoryRepository.findByProductId(productId, pageable);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public StockHistory getStockHistoryById(Long id) {
        return stockHistoryRepository.findById(id).orElse(null);
    }

    // This method logs stock changes into stock history
    @Transactional
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public void logStockChange(Long stockId, String changeType, int quantityChange, int previousQuantity,
                               int newQuantity, Long userId, Long referenceId, String notes) {

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock not found"));
        StockManager stockManager = stockManagerRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock Manager not found"));

        StockHistory.ChangeType enumChangeType;
        try {
            enumChangeType = StockHistory.ChangeType.valueOf(changeType);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Change Type");
        }

        StockTransaction stockTransaction = null;
        if (referenceId != null) {
            stockTransaction = stockTransactionRepository.findById(referenceId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock Transaction not found"));
        }

        StockHistory stockHistory = StockHistory.builder()
                .stock(stock)
                .product(stock.getProduct())
                .changeType(enumChangeType)
                .quantityChange(quantityChange)
                .previousQuantity(previousQuantity)
                .newQuantity(newQuantity)
                .stockManager(stockManager)
                .stockTransaction(stockTransaction)
                .notes(notes)
                .build();

        stockHistoryRepository.save(stockHistory);
    }
}