package com.auth.ums.services.PasswordResetService;

import com.auth.ums.requestmodels.PasswordForgetRequestModel.AddPasswordResetRequest;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.PasswordChangeByToken;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.PasswordReset.PasswordResetResponse;

public interface PasswordResetService {

    ApiResponse<PasswordResetResponse>forgetPassword(AddPasswordResetRequest request);
    ApiResponse<PasswordResetResponse>changePasswordByToken(PasswordChangeByToken request);

}
