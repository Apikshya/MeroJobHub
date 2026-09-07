package com.auth.ums.controller;

import com.auth.ums.requestmodels.ProfileModel.ChangePasswordRequest;
import com.auth.ums.requestmodels.ProfileModel.UpdateProfileRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Profile.ProfileResponse;
import com.auth.ums.services.ProfileService.ProfileService;
import com.auth.ums.services.UserService.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {
    @Autowired
    private ProfileService profileService;
    @Autowired
    private UserService userService;

    @PostMapping("/reset-password")
    ResponseEntity<ApiResponse<ProfileResponse>> resetPassword(@Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(profileService.resetPassword(request));
    }

    @GetMapping()
    ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile() {
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    @PutMapping("/update-profile")
    ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(request));
    }

}
