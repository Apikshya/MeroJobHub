package com.auth.ums.responsemodels.OTP;

import com.auth.ums.enums.OtpChannel;
import com.auth.ums.enums.OtpPurpose;
import com.auth.ums.enums.OtpStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Response returned to client (never includes raw OTP or hash)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpResponse {
    private Long otpId;
    private String contact;
    private OtpPurpose purpose;
    private OtpChannel channel;
    private OtpStatus status;
    private LocalDateTime expiresAt;
    private int attemptsRemaining;
    private int resendsRemaining;
    private String message;
}
