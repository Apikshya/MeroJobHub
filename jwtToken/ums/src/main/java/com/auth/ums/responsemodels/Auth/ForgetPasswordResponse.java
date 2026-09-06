package com.auth.ums.responsemodels.Auth;

import com.auth.ums.responsemodels.PasswordReset.PasswordResetDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ForgetPasswordResponse {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("dto")
    private PasswordResetDTO dto;
}
