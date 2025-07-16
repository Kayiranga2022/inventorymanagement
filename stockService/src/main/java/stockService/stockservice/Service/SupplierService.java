package stockService.stockservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stockService.stockservice.Entity.Supplier;
import stockService.stockservice.Repository.SupplierRepository;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    // Add a new supplier
    @Transactional
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Supplier addSupplier(Supplier supplier) {
        if (supplierRepository.findByPhone(supplier.getPhone()).isPresent()) {
            throw new RuntimeException("Supplier with this phone number already exists.");
        }
        return supplierRepository.save(supplier);
    }

    // Get all suppliers
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // Get supplier by ID
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    // Update supplier details
    @Transactional
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Supplier updateSupplier(Long id, Supplier updatedSupplier) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(updatedSupplier.getName());
            supplier.setPhone(updatedSupplier.getPhone());
            supplier.setEmail(updatedSupplier.getEmail());
            supplier.setAddress(updatedSupplier.getAddress());
            return supplierRepository.save(supplier);
        }).orElseThrow(() -> new RuntimeException("Supplier not found with ID: " + id));
    }

    // Delete a supplier
    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}