package com.auth.ums.requestmodels.PasswordForgetRequestModel;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AddPasswordResetRequest {

    @NotNull(message = "User ID is required")
    @JsonProperty("user_id")
    private Long userId;

    @NotBlank(message = "Token is required")
    @JsonProperty("token")
    private String token;

    @NotNull(message = "Token expiration time is required")
    @JsonProperty("token_expiration_time")
    private LocalDateTime tokenExpirationTime;

    @NotBlank(message = "Request IP address is required")
    @JsonProperty("request_ip_address")
    private String requestIpAddress;

    @JsonProperty("reset_time")
    private LocalDateTime resetTime;

    @JsonProperty("reset_ip_address")
    private String resetIpAddress;

    @NotBlank(message = "Reset method is required")
    @JsonProperty("reset_method")
    private String resetMethod; // EMAIL, PHONE_NUMBER

    @NotBlank(message = "Reset source is required")
    @JsonProperty("reset_source")
    private String resetSource;

    @JsonProperty("additional_info")
    private String additionalInfo;

}