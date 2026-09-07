package com.auth.ums.exceptions;

public class OtpResendTooSoonException extends RuntimeException {
    public OtpResendTooSoonException(String message) {
        super(message);
    }
}
