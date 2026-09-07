package com.auth.ums.services.UserService;

import com.auth.ums.requestmodels.Auth.AddUserRequest;
import com.auth.ums.requestmodels.Auth.DeleteUserRequest;
import com.auth.ums.requestmodels.Auth.LoginRequest;
import com.auth.ums.requestmodels.Auth.UpdateUserRequest;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.PasswordChangeByToken;
import com.auth.ums.requestmodels.ProfileModel.ChangePasswordRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.user.UserCountResponse;
import com.auth.ums.responsemodels.user.UserDto;
import com.auth.ums.responsemodels.user.UserResponse;
import com.auth.ums.responsemodels.user.UserResponseDto;
import com.auth.ums.utility.PageResponse;
import jakarta.validation.constraints.NotBlank;

public interface UserService {
    ApiResponse<UserResponse> adduser(AddUserRequest request);
    ApiResponse<UserResponse> addCompanyUser(AddUserRequest request,String companyCode);

    ApiResponse<UserResponse> signupCustomer(AddUserRequest request);
    ApiResponse<UserResponse> login(LoginRequest request);

    ApiResponse<UserResponse> findByUserId(Long id);

    ApiResponse<UserResponse> changePasswordByLoggedInUser(String userName, ChangePasswordRequest request);

    ApiResponse<UserResponse> findByUserName(@NotBlank(message = "User name is Required ") String userName);

    ApiResponse<UserResponse> passwordChangeByToken(Long userId, PasswordChangeByToken request);

    ApiResponse<UserResponse> getAllUser();
    ApiResponse<UserResponse> getRecentUsers();
    ApiResponse<UserCountResponse> getUserCount();

    ApiResponse<UserResponse> updateUser(UpdateUserRequest request);

    ApiResponse<UserResponse> deleteUser(DeleteUserRequest request);



    PageResponse<UserResponseDto> searchUsers(String keyword, int page, int size, String sortBy);

    ApiResponse<PageResponse<UserDto>> searchUsersNew(String keyword, int page, int size, String sortBy);

}
