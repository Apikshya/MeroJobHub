package com.auth.ums.requestmodels.Auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteUserRequest {
    private Long id;

    @NotBlank(message = "remarks is Required ")
    @JsonProperty("remarks")
    private String remarks;
}
