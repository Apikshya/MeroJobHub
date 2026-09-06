package com.auth.ums.requestmodels.ProfileModel;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "New PassWord is Required ")
    @JsonProperty("new_Password")
    private String newPassword;

    @NotBlank(message = "Conform PassWord is Required ")
    @JsonProperty("conform_Password")
    private String conformPassword;

    @NotBlank(message = "Old PassWord is Required ")
    @JsonProperty("old_Password")
    private String oldPassword;
}
