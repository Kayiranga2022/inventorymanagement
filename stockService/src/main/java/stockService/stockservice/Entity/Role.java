package stockService.stockservice.Entity;

import jakarta.persistence.*;
import lombok.Data; // Added lombok data annotation

@Entity
@Data // Lombok Data annotation
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    public Role() {}

    public Role(String name) {
        this.name = name;
    }
}