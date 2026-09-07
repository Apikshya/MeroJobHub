package com.auth.ums.services.RoleService;

import com.auth.ums.requestmodels.RoleRequestModel.AddRoleRequest;
import com.auth.ums.requestmodels.RoleRequestModel.DeleteRoleRequest;
import com.auth.ums.requestmodels.RoleRequestModel.UpdateRoleRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Role.RoleResponse;

public interface RoleService {

   ApiResponse<RoleResponse>addRole(AddRoleRequest request);
   ApiResponse<RoleResponse>updateRole(UpdateRoleRequest request);
   ApiResponse<RoleResponse>getRoleById(Long id);
   ApiResponse<RoleResponse>getAllRoll();
   ApiResponse<RoleResponse>deleteRole(DeleteRoleRequest request);
   ApiResponse<RoleResponse>getRoleByName(String name);
    ApiResponse<RoleResponse>geUserRoleByUserId(Long userId);
}
