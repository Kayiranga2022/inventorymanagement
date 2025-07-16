package stockService.stockservice.Entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "manager_action_logs")
public class ManagerActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "action")
    private String action;

    @Column(name = "details")
    private String details;

    @Column(name = "action_time")
    @CreationTimestamp
    private LocalDateTime actionTime;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private ManagerSession session;

    // Constructors
    public ManagerActionLog() {}

    public ManagerActionLog(Long userId, String action, String details, LocalDateTime actionTime, ManagerSession session) {
        this.userId = userId;
        this.action = action;
        this.details = details;
        this.actionTime = actionTime;
        this.session = session;
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

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getActionTime() {
        return actionTime;
    }

    public void setActionTime(LocalDateTime actionTime) {
        this.actionTime = actionTime;
    }

    public ManagerSession getSession() {
        return session;
    }

    public void setSession(ManagerSession session) {
        this.session = session;
    }

    @Override
    public String toString() {
        return "ManagerActionLog{" +
                "id=" + id +
                ", userId=" + userId +
                ", action='" + action + '\'' +
                ", details='" + details + '\'' +
                ", actionTime=" + actionTime +
                ", session=" + session +
                '}';
    }
}