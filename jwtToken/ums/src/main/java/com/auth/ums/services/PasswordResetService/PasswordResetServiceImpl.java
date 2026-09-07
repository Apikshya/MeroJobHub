package com.auth.ums.services.PasswordResetService;

import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.mapper.PasswordResetMapper;
import com.auth.ums.models.PasswordReset;
import com.auth.ums.repository.PasswordResetRepository;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.AddPasswordResetRequest;
import com.auth.ums.requestmodels.PasswordForgetRequestModel.PasswordChangeByToken;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.PasswordReset.PasswordResetResponse;
import com.auth.ums.services.Otp.OtpService;
import com.auth.ums.utility.JsonUtils;
import com.auth.ums.configs.ÄpiMessageCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {
    private static final Logger log = LoggerFactory.getLogger(PasswordResetServiceImpl.class);
    @Autowired
    PasswordResetRepository passwordResetRepository;

    OtpService otpService;
    @Autowired
    JwtUtil jwtUtil;


    @Override
    public ApiResponse<PasswordResetResponse> forgetPassword(AddPasswordResetRequest request) {
        PasswordResetResponse response = new PasswordResetResponse();
        log.info("Forget password request received for email/username: {}", JsonUtils.toJson(response));
        try {
            PasswordReset entity = new PasswordReset();
            entity = PasswordResetMapper.addPasswordReset(request);
            entity.setCreatedBy(jwtUtil.getCurrentUsername());
            entity.setCreatedDate(LocalDateTime.now());
            entity.setRequestTime(LocalDateTime.now());
            entity.setIsActive(true);
            entity.setStatus("ACTIVE");
            passwordResetRepository.save(entity);
            log.info("Password reset token generated successfully. Token: {}", JsonUtils.toJson(entity));
            response.setDto(PasswordResetMapper.toDTO(entity));
            //entity to dto mapper
            return ApiResponse.success(response, ÄpiMessageCodes.SUCCESSFUL.toString());
        } catch (Exception e) {
            log.error("Error while processing forget password request:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ApiResponse<PasswordResetResponse> changePasswordByToken(PasswordChangeByToken request) {
        PasswordResetResponse response = new PasswordResetResponse();
        log.info("Change password request received with token: {}", JsonUtils.toJson(response));
        try {
            Optional<PasswordReset> optional = passwordResetRepository.findByTokenAndStatus(request.getToken(), "ACTIVE");
            if (optional.isEmpty()) {
                return ApiResponse.failure("Token is not Found");
            }
            LocalDateTime now = LocalDateTime.now();
            PasswordReset entity = optional.get();

            if (entity.getTokenExpirationTime().isBefore(now)) {
                return ApiResponse.failure("Token is expired");
            }

            response.setDto(PasswordResetMapper.toDTO(entity));
            entity.setStatus("INACTIVE");
            entity.setUpdatedBy(jwtUtil.getCurrentUsername());
            entity.setUpdatedDate(LocalDateTime.now());
            passwordResetRepository.save(entity);
            log.info("Password reset completed successfully for token: {}", JsonUtils.toJson(request));
            return ApiResponse.success(response, ÄpiMessageCodes.FETCH_SUCCESSFULLY.toString());

        } catch (Exception e) {
            log.error("Error while changing password using token:{}", e.getMessage(), e);
            return ApiResponse.exception(e.getMessage());
        }
    }
}

