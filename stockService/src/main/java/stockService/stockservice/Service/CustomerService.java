package stockService.stockservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stockService.stockservice.Entity.Customer;
import stockService.stockservice.Repository.CustomerRepository;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // Add a new customer
    @Transactional
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Customer addCustomer(Customer customer) {
        if (customerRepository.findByPhone(customer.getPhone()).isPresent()) {
            throw new RuntimeException("Customer with this phone number already exists.");
        }
        return customerRepository.save(customer);
    }

    // Get all customers
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    // Update customer details
    @Transactional
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        return customerRepository.findById(id).map(customer -> {
            customer.setName(updatedCustomer.getName());
            customer.setPhone(updatedCustomer.getPhone());
            customer.setEmail(updatedCustomer.getEmail());
            customer.setAddress(updatedCustomer.getAddress());
            return customerRepository.save(customer);
        }).orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

    // Delete a customer
    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}