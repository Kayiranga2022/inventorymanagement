package stockService.stockservice.Payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class JwtResponse {
    private String token;            // Access token
    private String username;         // Username
    private List<String> roles;      // User roles
    private String refreshToken;     // Refresh token
}
