package stockService.stockservice.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stockService.stockservice.Entity.ManagerSession;
import stockService.stockservice.Repository.ManagerSessionRepository;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SessionManager {

    private static final Logger logger = LoggerFactory.getLogger(SessionManager.class);
    private final ManagerSessionRepository managerSessionRepository;

    @Autowired
    public SessionManager(ManagerSessionRepository managerSessionRepository) {
        this.managerSessionRepository = managerSessionRepository;
    }

    // Start a session for a user
    public ManagerSession startSession(String shiftName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getUser().getId();
            LocalDateTime now = LocalDateTime.now();

            ManagerSession session = new ManagerSession();
            session.setUserId(userId);
            session.setStartTime(now);
            session.setLastActivityTime(now);
            session.setShiftName(shiftName);
            logger.info("Starting session for user ID: {} with shift: {}", userId, shiftName);
            return managerSessionRepository.save(session);
        } else {
            logger.warn("No authentication found or invalid principal when starting session.");
            return null;
        }
    }

    // Update the last activity time of the current session
    @Transactional
    public void updateLastActivityTime() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getUser().getId();
            getCurrentSession().ifPresentOrElse(session -> {
                session.setLastActivityTime(LocalDateTime.now());
                managerSessionRepository.save(session);
            }, () -> logger.warn("No active session found for user ID: {}", userId));
        } else {
            logger.warn("No authentication found or invalid principal when updating last activity time.");
        }
    }

    // End the session of the current user
    @Transactional
    public void endSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getUser().getId();
            getCurrentSession().ifPresentOrElse(session -> {
                session.setEndTime(LocalDateTime.now());
                managerSessionRepository.save(session);
                logger.info("Session ended for user ID: {}", userId);
            }, () -> logger.warn("No active session found for user ID: {}", userId));
        } else {
            logger.warn("No authentication found or invalid principal when ending session.");
        }
    }

    // Get the current active session for the user
    public Optional<ManagerSession> getCurrentSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getUser().getId();
            return managerSessionRepository.findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(userId);
        } else {
            logger.warn("No authentication found or invalid principal when getting current session.");
            return Optional.empty();
        }
    }

    // Save or update the session (new method added here)
    @Transactional
    public void saveSession(ManagerSession session) {
        logger.info("Saving session for user ID: {}", session.getUserId());  // Log to confirm
        managerSessionRepository.save(session);
        logger.info("Session for user ID: {} saved successfully", session.getUserId());  // Log to confirm
    }

    // Get the current active session for a specific user
    // Get the current active session for a specific user ID
    public Optional<ManagerSession> getCurrentSessionForUser(Long userId) {
        return managerSessionRepository.findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(userId);
    }

}
