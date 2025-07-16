package stockService.stockservice.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "manager_sessions")
public class ManagerSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "last_activity_time")
    private LocalDateTime lastActivityTime;

    @Column(name = "shift_name")
    private String shiftName;

    // Constructors
    public ManagerSession() {
    }

    public ManagerSession(Long userId, LocalDateTime startTime, LocalDateTime endTime, LocalDateTime lastActivityTime, String shiftName) {
        this.userId = userId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.lastActivityTime = lastActivityTime;
        this.shiftName = shiftName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public LocalDateTime getLastActivityTime() {
        return lastActivityTime;
    }

    public void setLastActivityTime(LocalDateTime lastActivityTime) {
        this.lastActivityTime = lastActivityTime;
    }

    public String getShiftName() {
        return shiftName;
    }

    public void setShiftName(String shiftName) {
        this.shiftName = shiftName;
    }

    // toString() for debugging (optional)
    @Override
    public String toString() {
        return "ManagerSession{" +
                "id=" + id +
                ", userId=" + userId +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", lastActivityTime=" + lastActivityTime +
                ", shiftName='" + shiftName + '\'' +
                '}';
    }
}