package com.auth.ums.responsemodels.Auth;

import com.auth.ums.responsemodels.user.UserDto;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class LoginResponse {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("token")
    private String token;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("token_expiry_time")
    private String tokenExpiryTime;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("user")
    private UserDto user;

    @JsonProperty("roles")
    private List<String> roles;
}
