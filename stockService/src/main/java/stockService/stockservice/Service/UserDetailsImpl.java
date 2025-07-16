package stockService.stockservice.Service;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import stockService.stockservice.Entity.User;
import stockService.stockservice.Entity.Role;
import java.util.Collection;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {
    private final User user;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(User user, String password, Collection<Role> roles) {
        this.user = user;
        this.password = password;
        this.authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName().toUpperCase())) // Keep ROLE_ here
                .collect(Collectors.toSet());
    }

    // ✅ FIX: Add getId() method to return the user ID
    public Long getId() {
        return user.getId();
    }

    public User getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}