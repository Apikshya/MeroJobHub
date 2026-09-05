package com.auth.ums.jwtsecurity;


import com.auth.ums.models.User;
import com.auth.ums.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Component
public class JwtUtil {

//    /* ================== CHANGE THIS ================== */
//    private static final String SECRET_KEY = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_KEY_256_BITS";
//    /* ================================================= */
//
//    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // 15 min
//    private static final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 days
//
//    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    private final Key key;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    // Constructor injection ensures values are available at bean creation
    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration}") long accessTokenExpiration,
            @Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration
    ) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters long for HS256.");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    /* ----------- ACCESS TOKEN ----------- */
    public String generateAccessToken(String username, List<String> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles) // store list of roles
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /* ----------- REFRESH TOKEN ----------- */
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /* ----------- VALIDATION ----------- */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public String getUsername(String token) {
        return getClaims(token).getSubject();
    }

    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        return (List<String>) getClaims(token).get("roles");
    }

    /* ----------- NEW METHODS FOR EXPIRY ----------- */

    /* ----------- EXPIRY METHODS ----------- */

    // Get expiry as java.util.Date
    public Date getExpiryDate(String token) {
        return getClaims(token).getExpiration();
    }

    // Get expiry as ZonedDateTime in system default timezone
    public ZonedDateTime getExpiryDateTime(String token) {
        Date expiry = getExpiryDate(token);
        return Instant.ofEpochMilli(expiry.getTime()).atZone(ZoneId.systemDefault());
    }

    // Get expiry as formatted string
    public String getExpiryDateTimeFormatted(String token, String pattern) {
        ZonedDateTime expiry = getExpiryDateTime(token);
        return expiry.format(java.time.format.DateTimeFormatter.ofPattern(pattern));
    }

    // Remaining time in milliseconds
    public long getRemainingMillis(String token) {
        return getExpiryDate(token).getTime() - System.currentTimeMillis();
    }

    // Remaining time in seconds
    public long getRemainingSeconds(String token) {
        return getRemainingMillis(token) / 1000;
    }
    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName(); // username
        }

        return null;
    }

    // ===================== ✅ NEW METHOD (ADDED) =====================
    /**
     * Get logged-in user's ID from JWT token
     * Uses Spring Security Context (BEST PRACTICE)
     */
    public Long getUserIdFromToken(UserRepository userRepository) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String username = authentication.getName();

        return userRepository.findByEmail(username)
                .map(User::getId)
                .orElse(null);
    }
}
