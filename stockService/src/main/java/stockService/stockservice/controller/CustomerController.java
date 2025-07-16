package stockService.stockservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.Customer;
import stockService.stockservice.Service.CustomerService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerService customerService;

    @PostMapping("/add")
    public ResponseEntity<Customer> addCustomer(@RequestBody Customer customer, Authentication authentication) {
        logger.info("Authenticated user for addCustomer: {}", authentication);
        return ResponseEntity.ok(customerService.addCustomer(customer));
    }

    @GetMapping("/all")
    public List<Customer> getAllCustomers(Authentication authentication) {
        logger.info("Authenticated user for getAllCustomers: {}", authentication);
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Customer>> getCustomerById(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for getCustomerById: {}", authentication);
        Optional<Customer> customer = customerService.getCustomerById(id);
        if (customer.isPresent()) {
            return ResponseEntity.ok(customer);
        } else {
            return ResponseEntity.notFound().build();
        }

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer updatedCustomer, Authentication authentication) {
        logger.info("Authenticated user for updateCustomer: {}", authentication);
        try {
            return ResponseEntity.ok(customerService.updateCustomer(id, updatedCustomer));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for deleteCustomer: {}", authentication);
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}