package com.auth.ums.controller;

import com.auth.ums.requestmodels.Otp.GenerateOtpRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.OTP.OtpResponse;
import com.auth.ums.responsemodels.OTP.VerifyOtpResponse;

import com.auth.ums.requestmodels.Otp.ResendOtpRequest;
import com.auth.ums.requestmodels.Otp.VerifyOtpRequest;

import com.auth.ums.services.Otp.OtpService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Testing controller for OTP flows.
 * Example usage (forgot password):
 *   POST /api/otp/generate
 *   { "contact": "user@example.com", "purpose": "FORGOT_PASSWORD", "channel": "EMAIL" }
 *
 *   POST /api/otp/verify
 *   { "contact": "user@example.com", "purpose": "FORGOT_PASSWORD", "otp": "123456" }
 *
 * Example usage (transaction password, tied to a specific transaction):
 *   POST /api/otp/generate
 *   { "contact": "9779800000000", "purpose": "TRANSACTION_PASSWORD",
 *     "channel": "SMS", "referenceId": "TXN-98765" }
 */
@RestController
@RequestMapping("/api/v1/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/generate")
    public  ResponseEntity<ApiResponse<OtpResponse>> generate(
            @RequestBody GenerateOtpRequest request,
            HttpServletRequest httpRequest) {
        enrichRequestMeta(request, httpRequest);
        return ResponseEntity.ok(otpService.generateOtp(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<VerifyOtpResponse>> verify(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(otpService.verifyOtp(request));
    }

    @PostMapping("/resend")
    public ResponseEntity<ApiResponse<OtpResponse>> resend(
            @RequestBody ResendOtpRequest request,
            HttpServletRequest httpRequest) {
        request.setIpAddress(clientIp(httpRequest));
        request.setDeviceInfo(httpRequest.getHeader("User-Agent"));
        return ResponseEntity.ok(otpService.resendOtp(request));
    }

    @PostMapping("/{otpId}/invalidate")
    public ResponseEntity<Void> invalidate(
            @PathVariable Long otpId,
            @RequestParam String contact) {
        otpService.invalidateOtp(otpId, contact);
        return ResponseEntity.noContent().build();
    }

    // Manual trigger for the cleanup job — handy for testing without waiting on the scheduler
    @PostMapping("/expire-stale")
    public  ResponseEntity<String> expireStale() {
        int count = otpService.expireStaleOtps();
        return ResponseEntity.ok(count + " OTP(s) marked as expired.");
    }

    private void enrichRequestMeta(GenerateOtpRequest request, HttpServletRequest httpRequest) {
        request.setIpAddress(clientIp(httpRequest));
        request.setDeviceInfo(httpRequest.getHeader("User-Agent"));
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        return (forwarded != null && !forwarded.isBlank())
                ? forwarded.split(",")[0].trim()
                : request.getRemoteAddr();
    }
}