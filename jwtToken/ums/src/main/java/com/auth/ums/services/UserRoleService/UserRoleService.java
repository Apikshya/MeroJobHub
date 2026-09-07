package com.auth.ums.services.UserRoleService;

import com.auth.ums.requestmodels.UserRoleRequestModel.AddUserRoleRequest;
import com.auth.ums.requestmodels.UserRoleRequestModel.DeleteUserRoleRequest;
import com.auth.ums.requestmodels.UserRoleRequestModel.UpdateUserRoleRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.UserRole.UserRoleResponse;

public interface UserRoleService {
    ApiResponse<UserRoleResponse>addUserRole(AddUserRoleRequest request);
    ApiResponse<UserRoleResponse>updateUserRole(UpdateUserRoleRequest request);
    ApiResponse<UserRoleResponse>deleteUserRole(DeleteUserRoleRequest request);
    ApiResponse<UserRoleResponse>getAllUserRole();

}
