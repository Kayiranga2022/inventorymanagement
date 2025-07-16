package stockService.stockservice.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import stockService.stockservice.Entity.ManagerActionLog;
import stockService.stockservice.Entity.ManagerSession;
import stockService.stockservice.Repository.ManagerActionLogRepository;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ManagerActionLogService {

    private static final Logger logger = LoggerFactory.getLogger(ManagerActionLogService.class);

    @Autowired
    private ManagerActionLogRepository managerActionLogRepository;

    @Autowired
    private SessionManager sessionManager;

    public void logAction(String action, String details, Long userId) {
        ManagerActionLog log = new ManagerActionLog();
        log.setAction(action);
        log.setDetails(details);
        log.setUserId(userId);
        log.setActionTime(LocalDateTime.now()); // Set the timestamp here!

        Optional<ManagerSession> currentSession = sessionManager.getCurrentSession();
        if (currentSession.isPresent()) {
            log.setSession(currentSession.get());
        } else {
            logger.warn("No active session found for user ID: {}, action will not be associated with a session.", userId);
        }

        managerActionLogRepository.save(log);
    }

    public void logAction(String action, String details) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getUser().getId();
            logAction(action, details, userId);
        } else {
            logger.warn("No authentication found or invalid principal when logging action.");
        }
    }

    public void logAction(String action) {
        logAction(action, null);
    }
}