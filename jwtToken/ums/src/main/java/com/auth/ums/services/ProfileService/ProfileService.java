package com.auth.ums.services.ProfileService;

import com.auth.ums.requestmodels.ProfileModel.ChangePasswordRequest;
import com.auth.ums.requestmodels.ProfileModel.UpdateProfileRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.Profile.ProfileResponse;

public interface ProfileService {
    ApiResponse<ProfileResponse> resetPassword(ChangePasswordRequest request);
    ApiResponse<ProfileResponse> getMyProfile();
    ApiResponse<ProfileResponse> updateProfile(UpdateProfileRequest request);

}
