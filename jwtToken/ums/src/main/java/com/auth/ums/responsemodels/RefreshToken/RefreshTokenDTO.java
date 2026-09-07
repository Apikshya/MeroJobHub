package com.auth.ums.responsemodels.RefreshToken;

import com.auth.ums.responsemodels.BaseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class RefreshTokenDTO extends BaseDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("token_hash")
    private String tokenHash;

    @JsonProperty("expires_at")
    private LocalDateTime expiresAt;

    @JsonProperty("revoked")
    private boolean revoked;

}
