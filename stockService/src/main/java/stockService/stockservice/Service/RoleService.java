package stockService.stockservice.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stockService.stockservice.Entity.Role;
import stockService.stockservice.Repository.RoleRepository;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public Role createRoleIfNotExists(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();  // Fetch all roles from DB
    }
}

