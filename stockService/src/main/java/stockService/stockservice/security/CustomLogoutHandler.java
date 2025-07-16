/*

package stockService.stockservice.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;
import stockService.stockservice.Service.ManagerSessionService;
import stockService.stockservice.Service.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomLogoutHandler implements LogoutHandler {

    private static final Logger logger = LoggerFactory.getLogger(CustomLogoutHandler.class);
    private final ManagerSessionService managerSessionService;

    public CustomLogoutHandler(ManagerSessionService managerSessionService) {
        this.managerSessionService = managerSessionService;
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        if (authentication == null) {
            logger.warn("CustomLogoutHandler: Authentication object is null. Checking security context.");
            authentication = SecurityContextHolder.getContext().getAuthentication();
        }

        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getUser().getId();
            logger.info("Logging out user ID: {}", userId);

            // Call endSession to properly close session at logout
            managerSessionService.endManagerSession(userId);
            SecurityContextHolder.clearContext();
        } else {
            logger.warn("CustomLogoutHandler: Unable to retrieve authenticated user. Session cannot be ended.");
        }
    }
}
*/