package stockService.stockservice.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stockService.stockservice.Entity.ManagerSession;
import stockService.stockservice.Entity.User;
import stockService.stockservice.Repository.ManagerSessionRepository;
import stockService.stockservice.Repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ManagerSessionService {

    private static final Logger logger = LoggerFactory.getLogger(ManagerSessionService.class);

    @Autowired
    private ManagerSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void createManagerSession(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            ManagerSession session = new ManagerSession();
            session.setUserId(user.getId());
            LocalDateTime now = LocalDateTime.now();
            session.setStartTime(now);
            session.setLastActivityTime(now);
            sessionRepository.save(session);
            logger.info("Manager session created for user: {}", username);
        } else {
            logger.warn("User not found: {}", username);
        }
    }

    @Transactional
    public void updateLastActivityTime(Long userId) {
        Optional<ManagerSession> sessionOptional = sessionRepository.findFirstByUserIdAndEndTimeIsNullOrderByLastActivityTimeDesc(userId);
        sessionOptional.ifPresentOrElse(session -> {
            session.setLastActivityTime(LocalDateTime.now());
            sessionRepository.save(session);
            logger.info("Last activity time updated for user ID: {}", userId);
        }, () -> logger.warn("No active session found for user ID: {}", userId));
    }

    @Transactional
    public void endManagerSession(Long userId) {
        logger.info("endManagerSession called for user ID: {}", userId); // Added log
        // Add this line to log the user ID:
        logger.info("endManagerSession received userId: {}", userId);
        Optional<ManagerSession> sessionOptional = sessionRepository.findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(userId);
        sessionOptional.ifPresentOrElse(session -> {
            logger.info("Active session found: {}", session); // Added log
            session.setEndTime(LocalDateTime.now());
            sessionRepository.save(session);
            logger.info("Session ended: {}", session); // Added log
        }, () -> logger.warn("No active session found for user ID: {}", userId));
    }
}