package com.auth.ums.responsemodels.OTP;

import com.auth.ums.enums.OtpStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpResponse {
    private boolean success;
    private OtpStatus status;
    private String message;
    private int attemptsRemaining;
}