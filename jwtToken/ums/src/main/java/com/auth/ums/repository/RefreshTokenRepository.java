package com.auth.ums.repository;

import com.auth.ums.models.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {

    @Query(
            value = "SELECT * FROM refresh_token " +
                    "WHERE token_hash = :tokenHash " +
                    "AND is_active = true " +
                    "AND revoked = false " +
                    "AND expires_at > now()",
            nativeQuery = true
    )
    Optional<RefreshToken> findByTokenHash(@Param("tokenHash") String tokenHash);

}
