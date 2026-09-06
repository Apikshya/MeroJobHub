package com.auth.ums.requestmodels.Otp;

import com.auth.ums.enums.OtpChannel;
import com.auth.ums.enums.OtpPurpose;
import lombok.Data;

@Data
public class GenerateOtpRequest {
    private Long userId;              // nullable — may not be resolved yet (e.g. forgot password by email)
    private String contact;           // email or phone
    private OtpPurpose purpose;
    private OtpChannel channel;
    private String referenceId;       // e.g. transactionId, required for TRANSACTION_PASSWORD
    private String ipAddress;
    private String deviceInfo;
}
