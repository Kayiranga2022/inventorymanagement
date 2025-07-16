package stockService.stockservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.User;
import stockService.stockservice.Entity.ManagerSession;
import stockService.stockservice.Payload.JwtResponse;
import stockService.stockservice.Payload.LoginRequest;
import stockService.stockservice.Payload.RefreshTokenRequest;
import stockService.stockservice.Payload.RefreshTokenResponse;
import stockService.stockservice.Service.SessionManager;
import stockService.stockservice.Service.UserDetailsImpl;
import stockService.stockservice.Service.UserService;
import stockService.stockservice.security.JwtUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final SessionManager sessionManager;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtUtils jwtUtils, SessionManager sessionManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.sessionManager = sessionManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            return ResponseEntity.badRequest().body("User must have at least one role.");
        }

        User registeredUser = userService.registerUser(user, user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toSet()));
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String username = userDetails.getUsername();
            List<String> roles = userDetails.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList());

            String accessToken = jwtUtils.generateJwtToken(username, roles);
            String refreshToken = jwtUtils.generateRefreshToken(username, roles);

            if (roles.contains("ROLE_MANAGER")) {
                sessionManager.startSession("Default Shift");
            }

            return ResponseEntity.ok(new JwtResponse(accessToken, username, roles, refreshToken));

        } catch (Exception e) {
            logger.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (refreshToken == null || !jwtUtils.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token");
        }

        String username = jwtUtils.getUsernameFromRefreshToken(refreshToken);
        List<String> roles = jwtUtils.getRolesFromRefreshToken(refreshToken);

        String newAccessToken = jwtUtils.generateJwtToken(username, roles);
        String newRefreshToken = jwtUtils.generateRefreshToken(username, roles);

        return ResponseEntity.ok(new RefreshTokenResponse(newAccessToken, newRefreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            logger.warn("No authenticated user found.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();

        Optional<ManagerSession> sessionOpt = sessionManager.getCurrentSessionForUser(userId);

        if (sessionOpt.isEmpty()) {
            logger.warn("No active session found for user {}", userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No active session found");
        }

        ManagerSession session = sessionOpt.get();
        session.setEndTime(LocalDateTime.now());
        logger.info("Ending session for user {} at {}, session ID: {}", userDetails.getUsername(), session.getEndTime(), session.getId());

        try {
            sessionManager.saveSession(session);
            logger.info("Session saved successfully for user {}", userDetails.getUsername());
        } catch (Exception e) {
            logger.error("Failed to save session for user {}: {}", userDetails.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save session");
        }

        // Use SecurityContextLogoutHandler to clear authentication
        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, response, authentication);

        logger.info("Security context cleared for user {}", userDetails.getUsername());

        return ResponseEntity.ok("User successfully logged out");
    }
}