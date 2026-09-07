package com.auth.ums.services.ProfllePicture;

import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.ProfilePicture.ProfilePictureResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface ProfilePictureService {
    ApiResponse<ProfilePictureResponse> uploadProfilePicture(MultipartFile file);
    ApiResponse<ProfilePictureResponse> deleteProfilePicture();
    ResponseEntity<Resource> viewProfilePicture(Long userId);
    ApiResponse<ProfilePictureResponse> getCurrentProfilePicture();
}
