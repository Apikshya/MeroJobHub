package com.auth.ums.controller;

import com.auth.ums.requestmodels.Auth.AddUserRequest;
import com.auth.ums.requestmodels.Auth.ForgetPasswordRequest;
import com.auth.ums.requestmodels.Auth.LoginRequest;
import com.auth.ums.requestmodels.Auth.RefreshTokenRequest;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.PasswordChangeByToken;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Auth.ForgetPasswordResponse;
import com.auth.ums.responsemodels.Auth.LoginResponse;
import com.auth.ums.responsemodels.ChangePasswordByToken.ChangePasswordByTokenResponse;
import com.auth.ums.responsemodels.user.UserResponse;
import com.auth.ums.services.AuthService.AuthService;
import com.auth.ums.services.UserService.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthService authService;

    @PostMapping("signup")
    ResponseEntity<ApiResponse<UserResponse>> signup(@Valid @RequestBody AddUserRequest request) {
        return ResponseEntity.ok(userService.signupCustomer(request));
    }

    @PostMapping("login")
    ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("refresh-token")
    ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("forget-password")
    ResponseEntity<ApiResponse<ForgetPasswordResponse>> forgetPassword(@Valid @RequestBody ForgetPasswordRequest request) {
        return ResponseEntity.ok(authService.forgetPassword(request));
    }

    @PostMapping("change-password")
    ResponseEntity<ApiResponse<ChangePasswordByTokenResponse>> changePassword(@Valid @RequestBody PasswordChangeByToken request) {
        return ResponseEntity.ok(authService.passwordChangeByToken(request));

    }
}
