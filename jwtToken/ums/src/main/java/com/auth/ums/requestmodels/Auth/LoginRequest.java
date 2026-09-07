package com.auth.ums.requestmodels.Auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email is Required ")
    @JsonProperty("email")
    private String email;

    @NotBlank(message = "Password is Required ")
    @JsonProperty("password")
    private String password;
}
