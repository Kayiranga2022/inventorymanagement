package stockService.stockservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.Supplier;
import stockService.stockservice.Service.SupplierService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:3000")
public class SupplierController {

    private static final Logger logger = LoggerFactory.getLogger(SupplierController.class);

    @Autowired
    private SupplierService supplierService;

    @PostMapping("/add")
    public ResponseEntity<Supplier> addSupplier(@RequestBody Supplier supplier, Authentication authentication) {
        logger.info("Authenticated user for addSupplier: {}", authentication);
        try {
            return ResponseEntity.ok(supplierService.addSupplier(supplier));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Supplier>> getAllSuppliers(Authentication authentication) {
        logger.info("Authenticated user for getAllSuppliers: {}", authentication);
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Supplier>> getSupplierById(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for getSupplierById: {}", authentication);
        Optional<Supplier> supplier = supplierService.getSupplierById(id);
        if (supplier.isPresent()) {
            return ResponseEntity.ok(supplier);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier updatedSupplier, Authentication authentication) {
        logger.info("Authenticated user for updateSupplier: {}", authentication);
        try {
            return ResponseEntity.ok(supplierService.updateSupplier(id, updatedSupplier));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for deleteSupplier: {}", authentication);
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}