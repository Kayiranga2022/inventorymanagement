package stockService.stockservice.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import stockService.stockservice.Entity.User;
import stockService.stockservice.Repository.UserRepository;
import stockService.stockservice.Service.UserDetailsImpl;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("Loading user by username: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", username);
                    return new UsernameNotFoundException("Invalid username or password");
                });

        logger.info("User roles before mapping: {}", user.getRoles());

        UserDetailsImpl userDetails = new UserDetailsImpl(
                user,
                user.getPassword(), // Use the encoded password from the database
                user.getRoles()
        );

        logger.info("User loaded successfully: {}", username);
        logger.info("User details: {}", userDetails);
        logger.info("User authorities: {}", userDetails.getAuthorities());

        return userDetails;
    }
}