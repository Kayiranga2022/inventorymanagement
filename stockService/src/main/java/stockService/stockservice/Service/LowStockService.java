package stockService.stockservice.Service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import stockService.stockservice.Entity.Stock;
import stockService.stockservice.Entity.StockManager;
import stockService.stockservice.Repository.StockRepository;
import stockService.stockservice.Repository.StockManagerRepository;

import java.util.List;

@Service
public class LowStockService {

    private final StockRepository stockRepository;
    private final StockManagerRepository stockManagerRepository;
    private final EmailService emailService;

    public LowStockService(StockRepository stockRepository,
                           StockManagerRepository stockManagerRepository,
                           EmailService emailService) {
        this.stockRepository = stockRepository;
        this.stockManagerRepository = stockManagerRepository;
        this.emailService = emailService;
    }

    @Scheduled(fixedRate = 600000000) // Runs every 60 seconds (adjust as needed)
    public void checkLowStock() {
        List<Stock> lowStockItems = stockRepository.findByQuantityLessThanThreshold();

        if (!lowStockItems.isEmpty()) {
            StringBuilder message = new StringBuilder("<h3>⚠️ Low Stock Alert!</h3><ul>");

            for (Stock stock : lowStockItems) {
                message.append("<li><b>").append(stock.getName())
                        .append("</b>: Only ").append(stock.getQuantity()).append(" units left.</li>");
            }
            message.append("</ul>");

            String subject = "🚨 Low Stock Alert: Inventory Warning";

            // Fetch all stock managers
            List<StockManager> managers = stockManagerRepository.findAll();
            for (StockManager manager : managers) {
                emailService.sendEmail(manager.getEmail(), subject, message.toString());
            }
        }
    }
}
