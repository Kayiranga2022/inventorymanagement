package stockService.stockservice.Service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import stockService.stockservice.Entity.*;
import stockService.stockservice.Repository.*;
import stockService.stockservice.dto.StockTransactionRequest;
import stockService.stockservice.dto.TransactionFilterRequest;
import stockService.stockservice.dto.TransactionItemRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StockTransactionService {

    private final StockTransactionRepository stockTransactionRepository;
    private final StockTransactionItemRepository stockTransactionItemRepository;
    private final StockRepository stockRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final StockManagerRepository stockManagerRepository;
    private final LoanRepository loanRepository;
    private final StockHistoryRepository stockHistoryRepository;
    private final SessionManager sessionManager;
    private final UserRepository userRepository;
    private final ManagerActionLogService managerActionLogService;
    private final Logger logger = LoggerFactory.getLogger(StockTransactionService.class);

    @Transactional
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public StockTransaction createTransaction(StockTransactionRequest request) {
        logger.info("Received StockTransactionRequest: {}", request);

        if (request.getAmountPaid() == null) {
            logger.error("Amount paid is null in the request.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount paid cannot be null.");
        }

        if (request.getPaymentMethod() == null) {
            logger.error("Payment method is null in the request.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment method cannot be null.");
        }

        StockManager stockManager = stockManagerRepository.findById(request.getStockManagerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock Manager not found."));

        StockTransaction transaction = new StockTransaction();
        transaction.setMovementType(request.getMovementType());
        transaction.setSupplierId(request.getSupplierId());
        transaction.setCustomerId(request.getCustomerId());
        transaction.setStockManager(stockManager);
        transaction.setAmountPaid(request.getAmountPaid());
        transaction.setTotalAmount(BigDecimal.ZERO);
        transaction.setPaymentStatus(request.getPaymentStatus());
        transaction.setPaymentMethod(request.getPaymentMethod());

        // Use existing session or create a new one
        ManagerSession session = sessionManager.getCurrentSession().orElse(sessionManager.startSession("Default Shift"));
        if (session != null) {
            transaction.setSessionId(session.getId());
            transaction.setSessionStartTime(session.getStartTime());
            // session.setSessionEndTime(session.getEndTime()); // Remove this line
        }

        transaction = stockTransactionRepository.saveAndFlush(transaction);

        logger.info("Transaction created with ID: {}", transaction.getId());

        processTransactionItems(request, transaction);

        transaction.setTotalAmount(transaction.calculateTotalAmount());

        transaction = stockTransactionRepository.save(transaction);

        logger.info("Transaction finalized with total amount: {}", transaction.getTotalAmount());

        if (transaction.getAmountPaid().compareTo(transaction.getTotalAmount()) < 0) {
            createLoan(transaction);
        }

        if (session != null) {
            managerActionLogService.logAction("Created transaction ID: " + transaction.getId(), "User ID: " + session.getUserId());
        }

        return transaction;
    }

    private void createLoan(StockTransaction transaction) {
        Loan loan = new Loan();
        loan.setLoanAmount(transaction.getTotalAmount().subtract(transaction.getAmountPaid()));
        loan.setOutstandingAmount(loan.getLoanAmount());
        loan.setLoanDate(LocalDateTime.now());
        loan.setTransaction(transaction);

        if (transaction.getMovementType() == MovementType.SALE) {
            loan.setLoanType(Loan.LoanType.CUSTOMER_LOAN);
            loan.setEntity(customerRepository.findById(transaction.getCustomerId()).orElse(null));
        } else if (transaction.getMovementType() == MovementType.PURCHASE) {
            loan.setLoanType(Loan.LoanType.SUPPLIER_LOAN);
            loan.setEntity(supplierRepository.findById(transaction.getSupplierId()).orElse(null));
        }

        loanRepository.save(loan);
        logger.info("Loan created for transaction ID: {}", transaction.getId());
    }

    private void processTransactionItems(StockTransactionRequest request, StockTransaction transaction) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No items in the transaction request.");
        }

        for (TransactionItemRequest itemRequest : request.getItems()) {
            try {
                logger.info("Processing item: Stock ID: {}, Quantity: {}", itemRequest.getStockId(), itemRequest.getQuantity());
                Stock stock = stockRepository.findById(itemRequest.getStockId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock not found."));

                if (transaction.getMovementType() == MovementType.SALE && stock.getQuantity() < itemRequest.getQuantity()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for sale.");
                }

                int previousQuantity = stock.getQuantity();
                int newQuantity = previousQuantity;

                if (transaction.getMovementType() == MovementType.PURCHASE) {
                    newQuantity += itemRequest.getQuantity();
                } else if (transaction.getMovementType() == MovementType.SALE) {
                    newQuantity -= itemRequest.getQuantity();
                }

                stock.setQuantity(newQuantity);
                stockRepository.save(stock);

                StockTransactionItem transactionItem = new StockTransactionItem();
                transactionItem.setStockTransaction(transaction);
                transactionItem.setStock(stock);
                transactionItem.setQuantity(itemRequest.getQuantity());
                transactionItem.setPricePerUnit(itemRequest.getPricePerUnit());

                stockTransactionItemRepository.save(transactionItem);
                transaction.getItems().add(transactionItem);

                StockHistory stockHistory = new StockHistory();
                stockHistory.setStock(stock);
                stockHistory.setStockManager(transaction.getStockManager());
                stockHistory.setReferenceId(transaction.getId());
                stockHistory.setTimestamp(LocalDateTime.now());
                stockHistory.setQuantityChange(itemRequest.getQuantity());
                stockHistory.setStockTransaction(transaction);
                stockHistory.setChangeType(mapMovementTypeToChangeType(transaction.getMovementType()));
                stockHistory.setProduct(stock.getProduct());
                stockHistory.setPreviousQuantity(previousQuantity);
                stockHistory.setNewQuantity(newQuantity);

                logger.info("StockHistory object before save: {}", stockHistory);
                stockHistoryRepository.save(stockHistory);
                logger.info("StockHistory object saved");
            } catch (Exception e) {
                logger.error("Error processing item: ", e);
            }

        }
    }

    private StockHistory.ChangeType mapMovementTypeToChangeType(MovementType movementType) {
        return switch (movementType) {
            case PURCHASE -> StockHistory.ChangeType.ADDITION;
            case SALE -> StockHistory.ChangeType.REDUCTION;
            case TRANSFER -> StockHistory.ChangeType.ADJUSTMENT;
            case RETURN -> StockHistory.ChangeType.ADDITION;
        };
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<StockTransaction> getFilteredTransactions(TransactionFilterRequest filterRequest) {
        return stockTransactionRepository.findFilteredTransactions(
                filterRequest.getStartDateTime(),
                filterRequest.getEndDateTime(),
                filterRequest.getMovementType(),
                filterRequest.getPaymentStatus(),
                filterRequest.getSupplierId(),
                filterRequest.getCustomerId(),
                filterRequest.getProductId(),
                filterRequest.getSessionId(),
                filterRequest.getSessionStartTime(),
                filterRequest.getSessionEndTime()
        );
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Optional<StockTransaction> getTransactionById(Long id) {
        Optional<StockTransaction> transactionOptional = stockTransactionRepository.findById(id);

        if (transactionOptional.isPresent()) {
            StockTransaction transaction = transactionOptional.get();

            if (transaction.getSupplierId() !=null) {
                Supplier supplier = supplierRepository.findById(transaction.getSupplierId()).orElse(null);
                transaction.setSupplier(supplier);
            }

            if (transaction.getCustomerId() != null) {
                Customer customer = customerRepository.findById(transaction.getCustomerId()).orElse(null);
                transaction.setCustomer(customer);
            }

            return Optional.of(transaction);
        } else {
            return Optional.empty();
        }
    }

    public List<StockTransaction> getAllTransactions() {
        return stockTransactionRepository.findAll();
    }
}

