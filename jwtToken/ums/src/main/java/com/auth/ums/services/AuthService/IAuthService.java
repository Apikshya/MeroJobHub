package com.auth.ums.services.AuthService;

import com.auth.ums.enums.OtpChannel;
import com.auth.ums.enums.OtpPurpose;
import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.requestmodels.Auth.ForgetPasswordRequest;
import com.auth.ums.requestmodels.Auth.LoginRequest;
import com.auth.ums.requestmodels.Otp.GenerateOtpRequest;
import com.auth.ums.requestmodels.Otp.VerifyOtpRequest;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.AddPasswordResetRequest;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.PasswordChangeByToken;
import com.auth.ums.requestmodels.RefreshTokenRequestModel.AddRefreshTokenRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Auth.ForgetPasswordResponse;
import com.auth.ums.responsemodels.Auth.LoginResponse;
import com.auth.ums.responsemodels.ChangePasswordByToken.ChangePasswordByTokenResponse;
import com.auth.ums.responsemodels.Role.RoleDTO;
import com.auth.ums.services.Otp.OtpService;
import com.auth.ums.services.PasswordResetService.PasswordResetService;
import com.auth.ums.services.RefreshTokenService.RefreshTokenService;
import com.auth.ums.services.RoleService.RoleService;
import com.auth.ums.services.UserService.UserService;
import com.auth.ums.utility.JsonUtils;
import com.auth.ums.configs.ApiResponseCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class IAuthService implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(IAuthService.class);
    @Autowired
    UserService userService;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    RoleService roleService;
    @Autowired
    RefreshTokenService refreshTokenService;
    @Autowired
    PasswordResetService passwordResetService;
    @Autowired
    OtpService otpService;
    @Override
    public ApiResponse<LoginResponse> login(LoginRequest request) {

        LoginResponse authResponse = new LoginResponse();
        var response = userService.login(request);

        log.info("user info : {}", JsonUtils.toJson(response));

        if (response != null && response.getCode().equals(ApiResponseCodes.SUCCESS)) {

            ///  jwt token ko concept use grnae

            // Extract roles
            List<String> roles = null;
            var userRoles = roleService.geUserRoleByUserId(response.getData().getUser().getId());

            log.info("user userRoles data : {}", JsonUtils.toJson(userRoles));

            if (userRoles != null && userRoles.getCode().equals(ApiResponseCodes.SUCCESS)) {

                roles = userRoles.getData().getDtos().stream().map(RoleDTO::getName).collect(Collectors.toList());

                log.info("user  roles  : {}", JsonUtils.toJson(roles));

            }

            // Generate tokens
            log.info("Generating JWT tokens for email: {}", response.getData().getUser().getEmail());
            String accessToken = jwtUtil.generateAccessToken(response.getData().getUser().getEmail(), roles);
            String refreshToken = jwtUtil.generateRefreshToken(response.getData().getUser().getEmail());
            authResponse.setToken(accessToken);
            authResponse.setRefreshToken(refreshToken);

            String formattedExpiryTime = jwtUtil.getExpiryDateTimeFormatted(accessToken, "yyyy-MM-dd HH:mm:ss");
            authResponse.setTokenExpiryTime(formattedExpiryTime);
            authResponse.setUser(response.getData().getUser());
            authResponse.setRoles(roles);
            // save refresh_token
            AddRefreshTokenRequest refTok = new AddRefreshTokenRequest();

            refTok.setUserId(response.getData().getUser().getId());
            refTok.setTokenHash(refreshToken);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime localDateTime = LocalDateTime.parse(formattedExpiryTime, formatter);
            refTok.setExpiresAt(localDateTime);
            refreshTokenService.addRefreshToken(refTok);

            log.info("Login completed successfully for email: {}", request.getEmail());
            return ApiResponse.success(authResponse, "login success");

        } else {
            log.warn("Login failed for email: {}", request.getEmail());
            return ApiResponse.failure("Either email or password is wrong");
        }

    }

    @Override
    public ApiResponse<LoginResponse> refreshToken(String tokenHash) {

        LoginResponse authResponse = new LoginResponse();
        var response = refreshTokenService.findByRefreshToken(tokenHash);

        log.info("refresh Token info : {}", JsonUtils.toJson(response));

        if (response != null && response.getCode().equals(ApiResponseCodes.SUCCESS)) {

            ///  jwt tonke ko convcept use grnay

            // Extract roles
            List<String> roles = null;
            var userRoles = roleService.geUserRoleByUserId(response.getData().getDto().getUserId());

            log.info("user userRoles data : {}", JsonUtils.toJson(userRoles));

            if (userRoles != null && userRoles.getCode().equals(ApiResponseCodes.SUCCESS)) {

                roles = userRoles.getData().getDtos().stream().map(RoleDTO::getName).collect(Collectors.toList());

                log.info("user  roles  : {}", JsonUtils.toJson(roles));

            }

            //get user info by user id

            var userData = userService.findByUserId(response.getData().getDto().getUserId());

            if (userData != null && userData.getCode().equals(ApiResponseCodes.SUCCESS)) {
                // Generate tokens
                String accessToken = jwtUtil.generateAccessToken(userData.getData().getUser().getEmail(), roles);
                String refreshToken = jwtUtil.generateRefreshToken(userData.getData().getUser().getEmail());
                authResponse.setToken(accessToken);
                authResponse.setRefreshToken(refreshToken);

                String formattedExpiryTime = jwtUtil.getExpiryDateTimeFormatted(accessToken, "yyyy-MM-dd HH:mm:ss");
                authResponse.setTokenExpiryTime(formattedExpiryTime);
                authResponse.setUser(userData.getData().getUser());

                // save refresh_token
                AddRefreshTokenRequest refTok = new AddRefreshTokenRequest();

                refTok.setUserId(userData.getData().getUser().getId());
                refTok.setTokenHash(refreshToken);

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime localDateTime = LocalDateTime.parse(formattedExpiryTime, formatter);
                refTok.setExpiresAt(localDateTime);
                refreshTokenService.addRefreshToken(refTok);
                log.info("New refresh token saved successfully for userId {}", JsonUtils.toJson(userData.getData().getUser().getId()));
                log.info("Token refresh completed successfully for userId{}", JsonUtils.toJson(refreshToken));
                return ApiResponse.success(authResponse, "refreshed  successfully");
            } else {
                log.warn("User not found or invalid for userId");
                return ApiResponse.failure("Invalid user");
            }

        } else {
            log.warn("Invalid or expired refresh token");
            return ApiResponse.failure("Invalid Token");
        }
    }

    @Override
    public ApiResponse<ForgetPasswordResponse> forgetPassword(ForgetPasswordRequest request) {
        log.info("Forget password request received for username: {}", JsonUtils.toJson(request));
        ForgetPasswordResponse response = new ForgetPasswordResponse();
        ///  find by request.userName user service
        var userResponse = userService.findByUserName(request.getUserName());
        log.info("User lookup response for username: {}", JsonUtils.toJson(userResponse));

        if (userResponse != null && userResponse.getCode().equals(ApiResponseCodes.SUCCESS)) {
            ///success
            ///PasswordReset add grnay
            AddPasswordResetRequest addrequest = new AddPasswordResetRequest();
            addrequest.setUserId(userResponse.getData().getUser().getId());


            GenerateOtpRequest otpRequest = new GenerateOtpRequest();

            otpRequest.setUserId(userResponse.getData().getUser().getId());
            otpRequest.setContact(userResponse.getData().getUser().getEmail()); // or "+15551234567"
            otpRequest.setPurpose(OtpPurpose.FORGOT_PASSWORD);
            otpRequest.setChannel(OtpChannel.EMAIL); // or OtpChannel.SMS
            otpRequest.setReferenceId(request.getReferenceId()); // optional unless required for TRANSACTION_PASSWORD
            otpRequest.setIpAddress(request.getIpAddress());
            otpRequest.setDeviceInfo(request.getDeviceInfo());
            var otpresponse= otpService.generateOtpForForgetPassword(otpRequest);
            if (otpresponse != null && otpresponse.getCode().equals(ApiResponseCodes.SUCCESS)) {
                addrequest.setToken(otpresponse.getMessage());
                addrequest.setResetSource("EMAIL");

                LocalDateTime now = LocalDateTime.now();
                // Add 10 minutes
                LocalDateTime futureTime = now.plusMinutes(10);
                addrequest.setTokenExpirationTime(futureTime);

                var passwordResetResponse = passwordResetService.forgetPassword(addrequest);
                log.info("Password reset service response for userId: {}", JsonUtils.toJson(passwordResetResponse));


                if (passwordResetResponse != null && passwordResetResponse.getCode().equals(ApiResponseCodes.SUCCESS)) {
                    response.setDto(passwordResetResponse.getData().getDto());
                    log.info("Forget password process completed successfully");
                    return ApiResponse.success(response, passwordResetResponse.getMessage());

                } else {
                    log.warn("Forget password failed for userId");
                    return ApiResponse.failure(passwordResetResponse.getMessage());
                }
            }
            return ApiResponse.failure("failed to process");

        } else {
            log.warn("Forget password failed. User not found for username: {}", request.getUserName());
            return ApiResponse.failure("User not found");
        }
    }

    @Override
    public ApiResponse<ChangePasswordByTokenResponse> passwordChangeByToken(PasswordChangeByToken request) {
        log.info("Password change by token request received");

        ChangePasswordByTokenResponse response = new ChangePasswordByTokenResponse();
        log.info("Password reset token validation response: {}", JsonUtils.toJson(response));

        VerifyOtpRequest otpRequest = new VerifyOtpRequest();

        otpRequest.setContact(request.getContact());
        otpRequest.setPurpose(request.getPurpose());
        otpRequest.setReferenceId(request.getReferenceId());
        otpRequest.setOtp(request.getToken());

        var otpResponse=otpService.verifyOtp(otpRequest);
        if (otpResponse != null && otpResponse.getCode().equals(ApiResponseCodes.SUCCESS)) {
            var forgetResponse = passwordResetService.changePasswordByToken(request);

            if (forgetResponse != null && forgetResponse.getCode().equals(ApiResponseCodes.SUCCESS)) {

                ///  change password by token and user id
                var userResponse = userService.passwordChangeByToken(forgetResponse.getData().getDto().getUserId(), request);
                log.info("Password change response for userId: {}", JsonUtils.toJson(userResponse));
                if (userResponse != null && userResponse.getCode().equals(ApiResponseCodes.SUCCESS)) {
                    return ApiResponse.success(response, userResponse.getMessage());
                } else {
                    log.warn("Password change failed");
                    return ApiResponse.failure("Invalid request");
                }
            }
        }

        log.warn("Invalid or expired password reset token");
        return ApiResponse.failure("Invalid request");
    }


}
