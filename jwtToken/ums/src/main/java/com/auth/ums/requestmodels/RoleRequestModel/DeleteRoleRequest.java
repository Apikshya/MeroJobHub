package com.auth.ums.requestmodels.RoleRequestModel;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteRoleRequest {
    private Long id;

    @NotBlank(message = "Remarks is Required ")
    private String remarks;
}
