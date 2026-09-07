package com.auth.ums.component;

import com.auth.ums.services.Otp.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OtpCleanupScheduler {

    private final OtpService otpService;

    // Runs every 5 minutes — marks PENDING-but-expired OTPs as EXPIRED
    @Scheduled(fixedDelay = 5 * 60 * 1000)
    public void expireStaleOtps() {
        int count = otpService.expireStaleOtps();
        if (count > 0) {
            log.info("OTP cleanup job: expired {} stale OTP(s)", count);
        }
    }
}
