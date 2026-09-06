package com.auth.ums.exceptions;

public class OtpMismatchException extends RuntimeException {
    public OtpMismatchException(String message) {
        super(message);
    }
}
