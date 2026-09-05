package com.auth.ums.requestmodels.Auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @NotBlank(message = "Refresh Token is Required ")
    @JsonProperty("refresh_token")
    private String refreshToken;

}
