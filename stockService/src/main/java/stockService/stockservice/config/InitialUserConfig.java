package stockService.stockservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import stockService.stockservice.Entity.Role;
import stockService.stockservice.Entity.User;
import stockService.stockservice.Repository.RoleRepository;
import stockService.stockservice.Repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional; // Import Transactional
import java.util.HashSet;
import java.util.Set;

@Configuration
public class InitialUserConfig implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional // Add Transactional here
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create admin role if it doesn't exist
            Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() -> {
                Role newRole = new Role("ADMIN");
                return roleRepository.save(newRole);
            });

            // Attach the role to the persistence context
            adminRole = entityManager.merge(adminRole);

            // Create admin user
            User adminUser = new User();
            adminUser.setUsername("nesta");
            adminUser.setPassword(passwordEncoder.encode("password123")); // Change to a strong password
            adminUser.setEmail("kayinesta23@gmail.com");

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            adminUser.setRoles(roles);

            userRepository.save(adminUser);

            System.out.println("Initial admin user created.");
        }
    }
}