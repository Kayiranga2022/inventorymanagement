package stockService.stockservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.Role;
import stockService.stockservice.Service.RoleService;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping("/all")
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();  // Fetch all roles from DB
    }
}
