package stockService.stockservice.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stockService.stockservice.Entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Transactional
    @EntityGraph(attributePaths = "roles") // This ensures roles are eagerly fetched
    Optional<User> findByUsername(String username);
    //Optional<User> findByUsernameIgnoreCase(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
