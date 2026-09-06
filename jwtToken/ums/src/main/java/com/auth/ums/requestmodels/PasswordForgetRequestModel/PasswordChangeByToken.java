package com.auth.ums.requestmodels.PasswordForgetRequestModel;

import com.auth.ums.enums.OtpPurpose;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordChangeByToken {
    @NotBlank(message = "New PassWord is Required ")
    @JsonProperty("new_password")
    private String newPassword;

    @NotBlank(message = "Conform PassWord is Required ")
    @JsonProperty("conform_password")
    private String conformPassword;

    @NotBlank(message = "Token is Required ")
    @JsonProperty("token")
    private String token;

    private String contact;
    private OtpPurpose purpose;
    private String referenceId;       // must match if purpose requires it (e.g. transaction)

    private String ipAddress;
    private String deviceInfo;
}
