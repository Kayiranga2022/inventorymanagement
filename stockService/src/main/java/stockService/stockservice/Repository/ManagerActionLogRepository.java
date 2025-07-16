package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stockService.stockservice.Entity.ManagerActionLog;

import java.util.List;

@Repository
public interface ManagerActionLogRepository extends JpaRepository<ManagerActionLog, Long> {
    List<ManagerActionLog> findByUserId(Long userId);
}