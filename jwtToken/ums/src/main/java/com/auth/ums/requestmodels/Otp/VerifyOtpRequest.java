package com.auth.ums.requestmodels.Otp;


import com.auth.ums.enums.OtpPurpose;
import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String contact;
    private OtpPurpose purpose;
    private String referenceId;       // must match if purpose requires it (e.g. transaction)
    private String otp;               // raw OTP entered by user
}
