package com.auth.ums.services.AuthService;

import com.auth.ums.requestmodels.Auth.ForgetPasswordRequest;
import com.auth.ums.requestmodels.Auth.LoginRequest;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.PasswordChangeByToken;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Auth.ForgetPasswordResponse;
import com.auth.ums.responsemodels.Auth.LoginResponse;
import com.auth.ums.responsemodels.ChangePasswordByToken.ChangePasswordByTokenResponse;
import jakarta.validation.Valid;


public interface AuthService {
    ApiResponse<LoginResponse> login(LoginRequest request);

    ApiResponse<LoginResponse> refreshToken(String refreshToken);

    ApiResponse<ForgetPasswordResponse> forgetPassword(@Valid ForgetPasswordRequest request);

    ApiResponse<ChangePasswordByTokenResponse> passwordChangeByToken(@Valid PasswordChangeByToken request);

}
