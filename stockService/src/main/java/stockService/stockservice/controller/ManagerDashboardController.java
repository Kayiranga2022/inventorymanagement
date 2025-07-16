package stockService.stockservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import stockService.stockservice.Service.ManagerDashboardService;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/manager")
public class ManagerDashboardController {

    private static final Logger logger = LoggerFactory.getLogger(ManagerDashboardController.class);

    @Autowired
    private ManagerDashboardService managerDashboardService;

    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')") // Added Admin role access
    @GetMapping("/dashboard-data")
    public ResponseEntity<Map<String, Object>> getManagerDashboardData(Authentication authentication) {
        logger.info("Authenticated user for getManagerDashboardData: {}", authentication);
        try {
            Map<String, Object> dashboardData = managerDashboardService.getManagerDashboardData();
            logger.info("Dashboard data retrieved successfully: {}", dashboardData);
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            logger.error("Error retrieving manager dashboard data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred."));
        }
    }
}