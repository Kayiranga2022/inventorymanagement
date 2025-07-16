package stockService.stockservice.Service;

import org.springframework.stereotype.Service;
import stockService.stockservice.Entity.StockManager;
import stockService.stockservice.Repository.StockManagerRepository;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@Service
public class StockManagerService {
    private final StockManagerRepository stockManagerRepository;

    public StockManagerService(StockManagerRepository stockManagerRepository) {
        this.stockManagerRepository = stockManagerRepository;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Optional<StockManager> updateStockManager(Long id, StockManager updatedStockManager) {
        return stockManagerRepository.findById(id).map(existingStockManager -> {
            existingStockManager.setFirstName(updatedStockManager.getFirstName());
            existingStockManager.setLastName(updatedStockManager.getLastName());
            existingStockManager.setUsername(updatedStockManager.getUsername());
            existingStockManager.setEmail(updatedStockManager.getEmail());
            existingStockManager.setPassword(updatedStockManager.getPassword());
            return stockManagerRepository.save(existingStockManager);
        });
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public StockManager saveStockManager(StockManager stockManager) {
        return stockManagerRepository.save(stockManager);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MANAGER')")
    public Optional<StockManager> getStockManagerById(Long id) {
        return stockManagerRepository.findById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MANAGER')")
    public Optional<StockManager> getStockManagerByEmail(String email) {
        return stockManagerRepository.findByEmail(email);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MANAGER')")
    public List<StockManager> getAllStockManagers() {
        return stockManagerRepository.findAll();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteStockManager(Long id) {
        stockManagerRepository.deleteById(id);
    }
}