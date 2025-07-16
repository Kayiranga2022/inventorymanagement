package stockService.stockservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import stockService.stockservice.Entity.StockTransaction;
import stockService.stockservice.Entity.MovementType;
import stockService.stockservice.Entity.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {

    @Query("SELECT DISTINCT st FROM StockTransaction st " +
            "JOIN FETCH st.items sti " +
            "JOIN sti.stock s " +
            "WHERE (:startDate IS NULL OR st.timestamp >= :startDate) " +
            "AND (:endDate IS NULL OR st.timestamp <= :endDate) " +
            "AND (:movementType IS NULL OR st.movementType = :movementType) " +
            "AND (:paymentStatus IS NULL OR st.paymentStatus = :paymentStatus) " +
            "AND ((:supplierId IS NULL AND :customerId IS NULL) " +
            "OR (:supplierId IS NOT NULL AND st.supplierId = :supplierId) " +
            "OR (:customerId IS NOT NULL AND st.customerId = :customerId)) " +
            "AND (:productId IS NULL OR s.product.id = :productId) " +
            "AND (:sessionId IS NULL OR st.sessionId = :sessionId) " +
            "AND (:sessionStartTime IS NULL OR st.sessionStartTime >= :sessionStartTime) " +
            "AND (:sessionEndTime IS NULL OR st.sessionEndTime <= :sessionEndTime)")
    List<StockTransaction> findFilteredTransactions(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("movementType") MovementType movementType,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("supplierId") Long supplierId,
            @Param("customerId") Long customerId,
            @Param("productId") Long productId,
            @Param("sessionId") Long sessionId,
            @Param("sessionStartTime") LocalDateTime sessionStartTime,
            @Param("sessionEndTime") LocalDateTime sessionEndTime
    );
}