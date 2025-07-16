// stockService.stockservice.security.JwtUtils.java
package stockService.stockservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;
import javax.crypto.SecretKey;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    private final SecretKey secretKey;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    @Value("${jwt.refreshExpirationMs}")
    private long jwtRefreshExpirationMs;

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    public JwtUtils(@Value("${jwt.secret}") String jwtSecret) {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateJwtToken(String username, List<String> roles) {
        List<String> formattedRoles = roles.stream()
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .collect(Collectors.toList());

        Date expirationDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
        logger.info("JWT Expiration Time: {}", expirationDate);

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", formattedRoles)
                .setIssuedAt(new Date())
                .setExpiration(expirationDate)
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(String username, List<String> roles) {
        List<String> formattedRoles = roles.stream()
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", formattedRoles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtRefreshExpirationMs))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("An unexpected error has occurred during the validation of the jwt token: {}", e.getMessage());
        }
        return false;
    }

    public boolean validateRefreshToken(String refreshToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(refreshToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid refresh token signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid refresh token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Refresh token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Refresh token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Refresh token claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("An unexpected error has occurred during the validation of the refresh token: {}", e.getMessage());
        }
        return false;
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getUsernameFromRefreshToken(String refreshToken) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(refreshToken)
                .getBody()
                .getSubject();
    }

    public List<String> getRolesFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Object rolesObject = claims.get("roles");
        logger.debug("rolesObject: {}", rolesObject);

        if (rolesObject instanceof List<?>) {
            List<?> rolesList = (List<?>) rolesObject;
            if (rolesList.stream().allMatch(String.class::isInstance)) {
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) rolesList;
                logger.debug("Extracted roles: {}", roles);
                return roles;
            } else {
                logger.error("Roles claim is not a list of strings.");
            }
        } else {
            logger.error("Roles claim is not a list.");
        }
        return List.of();
    }

    public List<String> getRolesFromRefreshToken(String refreshToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(refreshToken)
                .getBody();

        Object rolesObject = claims.get("roles");
        logger.debug("rolesObject (refresh): {}", rolesObject);

        if (rolesObject instanceof List<?>) {
            List<?> rolesList = (List<?>) rolesObject;
            if (rolesList.stream().allMatch(String.class::isInstance)) {
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) rolesList;
                logger.debug("Extracted roles (refresh): {}", roles);
                return roles;
            } else {
                logger.error("Roles claim is not a list of strings (refresh).");
            }
        } else {
            logger.error("Roles claim is not a list (refresh).");
        }
        return List.of();
    }
}