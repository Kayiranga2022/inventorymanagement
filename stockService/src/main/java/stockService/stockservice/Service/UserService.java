package stockService.stockservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import stockService.stockservice.Entity.Role;
import stockService.stockservice.Entity.User;
import stockService.stockservice.Repository.UserRepository;
import stockService.stockservice.Repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public User registerUser(User user, Set<String> roleNames) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Set<Role> roles = roleNames.stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseGet(() -> {
                            Role newRole = new Role();
                            newRole.setName(roleName);
                            return roleRepository.save(newRole);
                        }))
                .collect(Collectors.toSet());

        user.setRoles(roles);

        return userRepository.save(user);
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElse(null);
    }
}