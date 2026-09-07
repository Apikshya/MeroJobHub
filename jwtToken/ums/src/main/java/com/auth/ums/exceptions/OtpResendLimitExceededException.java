package com.auth.ums.exceptions;

public class OtpResendLimitExceededException extends RuntimeException {
    public OtpResendLimitExceededException(String message) {
        super(message);
    }
}
