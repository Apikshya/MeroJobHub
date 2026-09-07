package com.auth.ums.exceptions;


public class InvalidOtpRequestException extends RuntimeException {
    public InvalidOtpRequestException(String message) {
        super(message);
    }
}