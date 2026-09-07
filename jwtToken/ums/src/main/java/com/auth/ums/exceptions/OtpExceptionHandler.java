package com.auth.ums.exceptions;

import com.auth.ums.configs.ApiResponseCodes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class OtpExceptionHandler {

    @ExceptionHandler(OtpNotFoundException.class)
    public ResponseEntity<Object> handleNotFound(OtpNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(OtpExpiredException.class)
    public ResponseEntity<Object> handleExpired(OtpExpiredException ex) {
        return build(HttpStatus.GONE, ex.getMessage());
    }

    @ExceptionHandler(OtpAlreadyUsedException.class)
    public ResponseEntity<Object> handleUsed(OtpAlreadyUsedException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(OtpLockedException.class)
    public ResponseEntity<Object> handleLocked(OtpLockedException ex) {
        return build(HttpStatus.LOCKED, ex.getMessage());
    }

    @ExceptionHandler(OtpMismatchException.class)
    public ResponseEntity<Object> handleMismatch(OtpMismatchException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(OtpResendLimitExceededException.class)
    public ResponseEntity<Object> handleResendLimit(OtpResendLimitExceededException ex) {
        return build(HttpStatus.TOO_MANY_REQUESTS, ex.getMessage());
    }

    @ExceptionHandler(OtpResendTooSoonException.class)
    public ResponseEntity<Object> handleResendTooSoon(OtpResendTooSoonException ex) {
        return build(HttpStatus.TOO_MANY_REQUESTS, ex.getMessage());
    }

    @ExceptionHandler(InvalidOtpRequestException.class)
    public ResponseEntity<Object> handleInvalid(InvalidOtpRequestException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    private ResponseEntity<Object> build(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("code", ApiResponseCodes.FAILURE);
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}