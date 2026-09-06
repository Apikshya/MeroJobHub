package com.auth.ums.requestmodels.UserRoleRequestModel;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteUserRoleRequest {
    private Long id;

    @NotBlank(message = "Remarks is Required ")
    private String remarks;
}
