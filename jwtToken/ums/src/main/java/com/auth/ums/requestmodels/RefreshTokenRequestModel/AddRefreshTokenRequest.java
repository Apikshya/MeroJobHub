package com.auth.ums.requestmodels.RefreshTokenRequestModel;


import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AddRefreshTokenRequest {
    private long userId;
    private String tokenHash;
    private LocalDateTime expiresAt;
    private boolean revoked;
}
