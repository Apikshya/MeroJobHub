package com.auth.ums.responsemodels.PasswordReset;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PasswordResetResponse {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("dto")
    private PasswordResetDTO dto;

}
