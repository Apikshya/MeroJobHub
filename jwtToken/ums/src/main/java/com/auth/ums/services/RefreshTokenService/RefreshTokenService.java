package com.auth.ums.services.RefreshTokenService;

import com.auth.ums.requestmodels.RefreshTokenRequestModel.AddRefreshTokenRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.RefreshToken.RefreshTokenResponse;

public interface RefreshTokenService {
    ApiResponse<RefreshTokenResponse> addRefreshToken(AddRefreshTokenRequest request);

    ApiResponse<RefreshTokenResponse> findByRefreshToken(String tokenHash);
}
