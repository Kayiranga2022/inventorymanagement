package stockService.stockservice.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stockService.stockservice.Entity.Product;
import stockService.stockservice.Entity.Stock;
import stockService.stockservice.Repository.ProductRepository;
import stockService.stockservice.Repository.StockRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import stockService.stockservice.dto.StockDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StockService {

    private static final Logger logger = LoggerFactory.getLogger(StockService.class);

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockHistoryService stockHistoryService;

    @Transactional
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Stock addStock(Long productId, Stock stock) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (stockRepository.findBySku(stock.getSku()).isPresent()) {
            throw new RuntimeException("SKU already exists!");
        }

        product.setQuantity(product.getQuantity() + stock.getQuantity()); // Update product quantity
        productRepository.save(product); // Save the updated product

        stock.setProduct(product);
        stock.setDoneAt(LocalDate.now());
        return stockRepository.save(stock);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<StockDTO> getAllStocks() {
        List<Stock> stockList = stockRepository.findAllWithProducts();
        logger.info("Stocks retrieved from repository: {}", stockList);
        return stockList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private StockDTO convertToDTO(Stock stock) {
        logger.info("Converting Stock to DTO: {}", stock);
        StockDTO dto = new StockDTO();
        dto.setId(stock.getId());
        dto.setSku(stock.getSku());
        dto.setName(stock.getName());
        dto.setSupplier(stock.getSupplier());
        dto.setQuantity(stock.getQuantity());
        dto.setPrice(stock.getPrice()); // Added price to DTO conversion
        dto.setCreatedAt(stock.getCreatedAt());
        dto.setDoneAt(stock.getDoneAt());
        dto.setExpirationDate(stock.getExpirationDate());
        return dto;
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Stock getStockBySku(String sku) {
        return stockRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Stock with SKU " + sku + " not found"));
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<Stock> getStocksBySupplier(String supplier) {
        return stockRepository.findBySupplier(supplier);
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Stock updateStock(Long stockId, Stock stock) {
        Stock existingStock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        Product product = existingStock.getProduct();

        int quantityDifference = stock.getQuantity() - existingStock.getQuantity();

        product.setQuantity(product.getQuantity() + quantityDifference);

        productRepository.save(product);

        existingStock.setQuantity(stock.getQuantity());
        existingStock.setSku(stock.getSku());
        existingStock.setSupplier(stock.getSupplier());
        existingStock.setPrice(stock.getPrice());

        if (stock.getDoneAt() != null) {
            existingStock.setDoneAt(stock.getDoneAt());
        }
        if (stock.getExpirationDate() != null) {
            existingStock.setExpirationDate(stock.getExpirationDate());
        }

        return stockRepository.save(existingStock);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }

    public Long getTotalStockCount() {
        return stockRepository.count();
    }

    public Long getLowStockAlertsCount() {
        return stockRepository.countByQuantityLessThanThreshold();
    }

    public Long getExpiredStockCount() {
        return stockRepository.countByExpirationDateLessThanEqual(LocalDate.now());
    }

    public Map<String, List<Integer>> getStockTrends() {
        return stockRepository.getStockTrendsData();
    }
}