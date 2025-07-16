// stockService.stockservice.security.JwtAuthenticationFilter.java
package stockService.stockservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        logger.debug("Request URI: {}", request.getRequestURI());

        String token = extractJwtFromRequest(request);

        if (token != null) {
            if (jwtUtils.validateJwtToken(token)) {
                String username = jwtUtils.getUsernameFromJwtToken(token);
                List<String> roles =jwtUtils.getRolesFromJwtToken(token);

                logger.debug("Extracted username: {}", username);
                logger.debug("Extracted roles: {}", roles);

                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    logger.debug("Loaded user details: {}", userDetails);
                    logger.debug("Loaded user authorities: {}", userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    logger.debug("Authentication set in SecurityContextHolder: {}", authentication);
                }
            } else {
                logger.debug("Invalid JWT token found in request.");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                return;
            }
        } else {
            logger.debug("No JWT token found in request.");
        }

        logger.debug("Authentication before chain.doFilter: {}", SecurityContextHolder.getContext().getAuthentication());
        chain.doFilter(request, response);
        logger.debug("Authentication after chain.doFilter: {}", SecurityContextHolder.getContext().getAuthentication());
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        logger.debug("Authorization Header: {}", bearerToken);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}