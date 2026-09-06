package com.auth.ums.controller;

import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.ProfilePicture.ProfilePictureResponse;
import com.auth.ums.services.ProfllePicture.ProfilePictureService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

//@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1/profile-picture")
public class ProfilePictureController {

    @Autowired
    private ProfilePictureService profilePictureService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProfilePictureResponse>> upload(
            @RequestPart("profilePicture") MultipartFile profilePicture
    ) {
        if (profilePicture == null || profilePicture.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("No file provided"));
        }

        return ResponseEntity.ok(
                profilePictureService.uploadProfilePicture(profilePicture)
        );
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<ProfilePictureResponse>> deleteProfilePicture() {
        return ResponseEntity.ok(profilePictureService.deleteProfilePicture());
    }

    @GetMapping("/view/{userId}")
    public ResponseEntity<org.springframework.core.io.Resource> viewProfilePicture(@PathVariable Long userId) {
        return profilePictureService.viewProfilePicture(userId);
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<ProfilePictureResponse>> getCurrentProfilePicture() {
        return ResponseEntity.ok(profilePictureService.getCurrentProfilePicture());
    }
}
