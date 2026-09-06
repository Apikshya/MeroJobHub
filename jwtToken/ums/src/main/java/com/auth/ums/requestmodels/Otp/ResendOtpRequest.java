package com.auth.ums.requestmodels.Otp;

import com.auth.ums.enums.OtpPurpose;
import lombok.Data;

@Data
public class ResendOtpRequest {
    private String contact;
    private OtpPurpose purpose;
    private String referenceId;
    private String ipAddress;
    private String deviceInfo;
}
