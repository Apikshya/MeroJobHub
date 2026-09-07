package com.auth.ums.requestmodels.UserRoleRequestModel;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRoleRequest {

    private Long id;

    @NotNull(message = "UserId is Required ")
    private Long userId;

    @NotNull(message = "RoleId is Required ")
    private Long roleId;
}
