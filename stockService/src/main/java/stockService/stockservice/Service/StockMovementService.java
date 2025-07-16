
/*package stockService.stockservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stockService.stockservice.Entity.*;
import stockService.stockservice.Repository.*;
import stockService.stockservice.dto.StockMovementReportRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockMovementService {

    @Autowired
    private StockMovementRepository stockMovementRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private StockManagerRepository stockManagerRepository;

    @Autowired
    private StockHistoryRepository stockHistoryRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Transactional
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public StockMovement logStockMovement(Long stockId, MovementType movementType, int quantity,
                                          Long stockManagerId, Long customerId, Long supplierId, boolean isPaid) {
        if (quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
        }

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock not found with ID: " + stockId));

        StockManager stockManager = stockManagerRepository.findById(stockManagerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock Manager not found with ID: " + stockManagerId));

        Customer customer = null;
        Supplier supplier = null;

        if (movementType == MovementType.SALE) {
            if (customerId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer ID is required for SALE movements");
            }
            customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + customerId));
        }

        if (movementType == MovementType.PURCHASE) {
            if (supplierId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Supplier ID is required for PURCHASE movements");
            }
            supplier = supplierRepository.findById(supplierId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found with ID: " + supplierId));
        }

        int previousQuantity = stock.getQuantity();
        int newQuantity = previousQuantity;

        switch (movementType) {
            case PURCHASE:
            case RETURN:
                newQuantity += quantity;
                break;
            case SALE:
            case TRANSFER:
                if (previousQuantity < quantity) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock. Available: " + previousQuantity);
                }
                newQuantity -= quantity;
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stock movement type: " + movementType);
        }

        stock.setQuantity(newQuantity);
        stockRepository.save(stock);

        LocalDateTime timestamp = LocalDateTime.now();

        StockMovement stockMovement = StockMovement.builder()
                .stock(stock)
                .movementType(movementType)
                .quantity(quantity)
                .timestamp(timestamp)
                .stockManager(stockManager)
                .customer(customer)
                .supplier(supplier)
                .isPaid(isPaid)
                .build();

        stockMovement = stockMovementRepository.save(stockMovement);

        StockHistory stockHistory = StockHistory.builder()
                .stock(stock)
                .product(stock.getProduct())
                .changeType(mapMovementTypeToChangeType(movementType))
                .quantityChange(quantity)
                .previousQuantity(previousQuantity)
                .newQuantity(newQuantity)
                .timestamp(timestamp)
                .stockManager(stockManager)
                .stockTransaction(null)
                .notes("Stock movement recorded for product: " + stock.getProduct().getName())
                .referenceId(stockMovement.getId()) // Set referenceId to StockMovement ID
                .build();

        stockHistoryRepository.save(stockHistory);

        return stockMovement;
    }

    private StockHistory.ChangeType mapMovementTypeToChangeType(MovementType movementType) {
        switch (movementType) {
            case PURCHASE:
                return StockHistory.ChangeType.ADDITION;
            case SALE:
                return StockHistory.ChangeType.REDUCTION;
            case TRANSFER:
                return StockHistory.ChangeType.ADJUSTMENT;
            case RETURN:
                return StockHistory.ChangeType.ADDITION; // Or REDUCTION, depending on your logic
            default:
                throw new IllegalArgumentException("Invalid MovementType: " + movementType);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<StockMovement> getStockMovementReport(StockMovementReportRequest request) {
        //Implement Filter logic.
        return stockMovementRepository.findAll();
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository.findAll();
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<StockMovement> getStockMovementsByStockId(Long stockId) {
        return stockMovementRepository.findByStock_Id(stockId);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Optional<StockMovement> getStockMovementById(Long id) {
        return stockMovementRepository.findById(id);
    }
}*/


package stockService.stockservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stockService.stockservice.Entity.*;
import stockService.stockservice.Repository.*;
import stockService.stockservice.dto.StockMovementReportRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Optional;
import java.util.List;

@Service
public class StockMovementService {

    @Autowired
    private StockMovementRepository stockMovementRepository;

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<StockMovement> getStockMovementReport(StockMovementReportRequest request) {
        //Implement Filter logic.
        return stockMovementRepository.findAll();
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository.findAll();
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<StockMovement> getStockMovementsByStockId(Long stockId) {
        return stockMovementRepository.findByStock_Id(stockId);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Optional<StockMovement> getStockMovementById(Long id) {
        return stockMovementRepository.findById(id);
    }
}