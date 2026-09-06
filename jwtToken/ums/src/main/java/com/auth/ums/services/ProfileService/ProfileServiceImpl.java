package com.auth.ums.services.ProfileService;

import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.mapper.ProfileMapper;
import com.auth.ums.repository.UserRepository;
import com.auth.ums.requestmodels.Auth.UpdateUserRequest;
import com.auth.ums.requestmodels.ProfileModel.ChangePasswordRequest;
import com.auth.ums.requestmodels.ProfileModel.UpdateProfileRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Profile.ProfileResponse;
import com.auth.ums.services.UserService.UserService;
import com.auth.ums.utility.JsonUtils;
import com.auth.ums.configs.ApiResponseCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileServiceImpl implements ProfileService {
    private static final Logger log = LoggerFactory.getLogger(ProfileServiceImpl.class);
    @Autowired
    UserService userService;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    UserRepository userRepository;

    @Override
    public ApiResponse<ProfileResponse> resetPassword(ChangePasswordRequest request) {
        ProfileResponse response = new ProfileResponse();
        // checking the NewPassword and conform password is same
        if (!request.getNewPassword().equals(request.getConformPassword())) {
            log.warn("Password and confirm password do not match");
            return ApiResponse.failure("Invalid request");
        }
        String userName = jwtUtil.getCurrentUsername();
        if (userName == null) {
            log.warn("No logged-in user found");
            return ApiResponse.failure("Invalid request");
        } else {
            log.info("Attempting to change password for user: {}", JsonUtils.toJson(userName));
            var changePassword = userService.changePasswordByLoggedInUser(userName, request);
            if (changePassword != null && changePassword.getCode().equals(ApiResponseCodes.SUCCESS)) {
                log.info("Password updated successfully for user: {}", JsonUtils.toJson(userName));
                response.setMyProfile(changePassword.getData().getUser());
                return ApiResponse.success(response, "Password updated successfully");
            } else {
                log.error("Password change failed for user: {}", JsonUtils.toJson(userName));
                return ApiResponse.failure("Password changed failed");
            }
        }
    }

    @Override
    public ApiResponse<ProfileResponse> getMyProfile() {
        log.info("Entered getMyProfile method");
        ProfileResponse response = new ProfileResponse();

        var userName = jwtUtil.getCurrentUsername();
        if (userName == null) {
            log.warn("No logged-in user found");
            return ApiResponse.failure("Invalid request");
        }
        log.info("Fetching profile for user: {}", JsonUtils.toJson(userName));
        var myProfile = userService.findByUserName(userName);

        if (myProfile != null && myProfile.getCode().equals(ApiResponseCodes.SUCCESS)) {
            log.info("Profile fetched successfully for user: {}", JsonUtils.toJson(userName));
            response.setMyProfile(myProfile.getData().getUser());
            return ApiResponse.success(response, myProfile.getMessage());
        } else {
            log.error("Failed to fetch profile for user: {}", JsonUtils.toJson(userName));
            return ApiResponse.failure(myProfile.getMessage());
        }
    }

    @Override
    public ApiResponse<ProfileResponse> updateProfile(UpdateProfileRequest request) {
        ProfileResponse response = new ProfileResponse();
        log.info("Entered updateProfile method");
        var userName = jwtUtil.getCurrentUsername();
        if (userName == null) {
            log.warn("No logged-in user found");
            return ApiResponse.failure("Invalid request");
        }
        log.info("Fetching profile to update for user: {}", JsonUtils.toJson(userName));
        var myProfile = userService.findByUserName(userName);
        if (myProfile != null && myProfile.getCode().equals(ApiResponseCodes.SUCCESS)) {

            //Admin le update garako updateuser request tanako..!
            UpdateUserRequest userRequest = new UpdateUserRequest();
            userRequest = ProfileMapper.updateProfile(userRequest, request);
            userRequest.setId(myProfile.getData().getUser().getId());
            log.info("Updating profile for user: {}", JsonUtils.toJson(userRequest));
            var updateProfile = userService.updateUser(userRequest);
            if (updateProfile != null && updateProfile.getCode().equals(ApiResponseCodes.SUCCESS)) {
                log.info("Profile updated successfully for user: {}", JsonUtils.toJson(userRequest));
                response.setMyProfile(updateProfile.getData().getUser());
                return ApiResponse.success(response, updateProfile.getMessage());
            } else {
                log.error("Profile update failed for user: {}. Reason: {}", userName, updateProfile != null ? updateProfile.getMessage() : "Unknown error");
                return ApiResponse.failure(updateProfile.getMessage());
            }
        } else {
            log.error("Failed to fetch profile for update for user: {}. Reason: {}", userName, myProfile != null ? myProfile.getMessage() : "Unknown error");
            return ApiResponse.failure(myProfile.getMessage());
        }
    }
}