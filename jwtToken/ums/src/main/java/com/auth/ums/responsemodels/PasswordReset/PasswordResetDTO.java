package com.auth.ums.responsemodels.PasswordReset;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PasswordResetDTO {

    // When the reset token will expire
    @JsonProperty("token_expiration_time")
    private LocalDateTime tokenExpirationTime;

    // Source of reset (WEB, MOBILE, ADMIN, etc.)
    @JsonProperty("token")
    private String token;

    @JsonProperty("user_id")
    private Long userId;

}
