package com.auth.ums.models;
import com.auth.ums.enums.OtpChannel;
import com.auth.ums.enums.OtpPurpose;
import com.auth.ums.enums.OtpStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(
        name = "otp",
        indexes = {
                @Index(name = "idx_otp_user_purpose", columnList = "user_id, purpose"),
                @Index(name = "idx_otp_contact_purpose", columnList = "contact, purpose")
        }
)
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // Nullable: some flows (e.g. FORGOT_PASSWORD) may not have a resolved user yet
    @Column(name = "user_id")
    private Long userId;

    // The email or phone number the OTP was sent to
    @Column(name = "contact", nullable = false)
    private String contact;

    // NEVER store the raw OTP — always hash it
    @Column(name = "otp_hash", nullable = false)
    private String otpHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", nullable = false, length = 40)
    private OtpPurpose purpose;

    @Enumerated(EnumType.STRING)
    @Column(name = "channel", nullable = false, length = 20)
    private OtpChannel channel;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private OtpStatus status = OtpStatus.PENDING;

    // Optional: ties the OTP to a specific business object (e.g. transaction id)
    @Column(name = "reference_id")
    private String referenceId;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "used", nullable = false)
    private boolean used = false;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    // --- Attempt / brute-force protection ---
    @Column(name = "attempt_count", nullable = false)
    private int attemptCount = 0;

    @Column(name = "max_attempts", nullable = false)
    private int maxAttempts = 5;

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    // --- Resend / throttling protection ---
    @Column(name = "resend_count", nullable = false)
    private int resendCount = 0;

    @Column(name = "max_resend_count", nullable = false)
    private int maxResendCount = 3;

    @Column(name = "next_resend_allowed_at")
    private LocalDateTime nextResendAllowedAt;

    // --- Audit / traceability ---
    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "device_info")
    private String deviceInfo;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // ---------------- Business logic helpers ----------------

    @Transient
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }

    @Transient
    public boolean isLocked() {
        return this.status == OtpStatus.LOCKED || this.attemptCount >= this.maxAttempts;
    }

    @Transient
    public boolean isUsable() {
        return !used
                && !isExpired()
                && !isLocked()
                && Boolean.TRUE.equals(isActive)
                && (status == OtpStatus.PENDING);
    }

    @Transient
    public boolean canResend() {
        return resendCount < maxResendCount
                && (nextResendAllowedAt == null || LocalDateTime.now().isAfter(nextResendAllowedAt));
    }

    public void markVerified() {
        this.used = true;
        this.usedAt = LocalDateTime.now();
        this.status = OtpStatus.VERIFIED;
    }

    public void registerFailedAttempt() {
        this.attemptCount++;
        if (this.attemptCount >= this.maxAttempts) {
            this.status = OtpStatus.LOCKED;
            this.lockedAt = LocalDateTime.now();
        }
    }

    public void markExpiredIfNeeded() {
        if (!used && isExpired() && status == OtpStatus.PENDING) {
            this.status = OtpStatus.EXPIRED;
        }
    }

    public void invalidate() {
        this.status = OtpStatus.INVALIDATED;
        this.isActive = false;
    }
}