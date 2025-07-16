// StockMovementRepository.java (Repository)
package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import stockService.stockservice.Entity.MovementType;
import stockService.stockservice.Entity.StockMovement;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    @Query("SELECT sm FROM StockMovement sm WHERE sm.stock.id = :stockId " +
            "AND sm.movementType = :movementType " +
            "AND sm.timestamp BETWEEN :startTime AND :endTime")
    List<StockMovement> findStockMovements(@Param("stockId") Long stockId,
                                           @Param("movementType") MovementType movementType,
                                           @Param("startTime") LocalDateTime startTime,
                                           @Param("endTime") LocalDateTime endTime);

    List<StockMovement> findByStock_Id(Long stockId);

    Optional<StockMovement> findById(Long id);

    List<StockMovement> findAll();
}