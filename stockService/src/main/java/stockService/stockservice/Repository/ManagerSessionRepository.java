package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stockService.stockservice.Entity.ManagerSession;
import java.util.Optional;

@Repository
public interface ManagerSessionRepository extends JpaRepository<ManagerSession, Long> {

    Optional<ManagerSession> findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(Long userId);

    Optional<ManagerSession> findFirstByUserIdAndEndTimeIsNullOrderByLastActivityTimeDesc(Long userId);
}