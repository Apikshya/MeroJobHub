package com.auth.ums.requestmodels.Auth;

import com.auth.ums.enums.OtpPurpose;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgetPasswordRequest {
    @NotBlank(message = "User name is Required ")
    @JsonProperty("user_name")
    private String userName;
    private OtpPurpose purpose;
    private String referenceId;
    private String ipAddress;
    private String deviceInfo;
}
