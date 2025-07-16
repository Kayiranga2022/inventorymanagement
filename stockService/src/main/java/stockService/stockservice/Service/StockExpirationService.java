package stockService.stockservice.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stockService.stockservice.Entity.ExpiredStock;
import stockService.stockservice.Entity.Product;
import stockService.stockservice.Entity.Stock;
import stockService.stockservice.Repository.ExpiredStockRepository;
import stockService.stockservice.Repository.ProductRepository;
import stockService.stockservice.Repository.StockManagerRepository;
import stockService.stockservice.Repository.StockRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class StockExpirationService {

    private static final Logger logger = LoggerFactory.getLogger(StockExpirationService.class);

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private ExpiredStockRepository expiredStockRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private StockManagerRepository stockManagerRepository;

    @Scheduled(cron = "0 0 9 * * ?") // Runs daily at 9 AM
    @Transactional
    public void checkAndNotifyExpiration() {
        LocalDate today = LocalDate.now();
        List<Stock> expiredStocks = stockRepository.findByExpirationDateLessThanEqual(today); // Corrected expiration check

        if (!expiredStocks.isEmpty()) {
            StringBuilder message = new StringBuilder();
            message.append("<h2>Stock Expiration Alert</h2>");
            message.append("<p>The following stocks have expired:</p>");
            message.append("<ul>");

            for (Stock stock : expiredStocks) {
                Product product = stock.getProduct();
                message.append("<li><b>").append(stock.getName()).append("</b> ")
                        .append("(Price: ").append(product.getPrice()).append(", Quantity: ").append(stock.getQuantity()).append(")</li>");

                ExpiredStock expiredStock = new ExpiredStock(
                        product,
                        product.getPrice(),
                        stock.getQuantity(),
                        stock.getExpirationDate()
                );
                expiredStockRepository.save(expiredStock);
                stockRepository.delete(stock);
                logger.info("Stock {} expired and archived.", stock.getId());
            }

            message.append("</ul>");

            List<String> recipients = stockManagerRepository.findAllEmails();
            for (String email : recipients) {
                try {
                    emailService.sendEmail(email, "Stock Expiration Alert", message.toString());
                    logger.info("Expiration email sent to: {}", email);
                } catch (Exception e) {
                    logger.error("Failed to send expiration email to: {}", email, e);
                }
            }
        } else {
            logger.info("No stocks expired today.");
        }
    }
}