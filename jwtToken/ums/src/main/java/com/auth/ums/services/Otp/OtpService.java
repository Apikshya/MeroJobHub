package com.auth.ums.services.Otp;
import com.auth.ums.enums.OtpChannel;
import com.auth.ums.enums.OtpPurpose;
import com.auth.ums.enums.OtpStatus;
import com.auth.ums.exceptions.*;
import com.auth.ums.models.Otp;
import com.auth.ums.repository.OtpRepository;
import com.auth.ums.requestmodels.Emails.EmailRequest;
import com.auth.ums.requestmodels.Otp.GenerateOtpRequest;
import com.auth.ums.requestmodels.Otp.ResendOtpRequest;
import com.auth.ums.requestmodels.Otp.VerifyOtpRequest;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.OTP.OtpResponse;
import com.auth.ums.responsemodels.OTP.VerifyOtpResponse;
import com.auth.ums.services.EmailService.EmailService;
import com.auth.ums.utility.EmailTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    // Plug in your real senders here (SMS gateway / SMTP / push service)
    // private final NotificationService notificationService;

    private final EmailService emailService;

    private static final SecureRandom RANDOM = new SecureRandom();

    // Per-purpose configuration — tune as needed, or externalize to application.yml
    private static final Map<OtpPurpose, Integer> EXPIRY_MINUTES = Map.of(
            OtpPurpose.FORGOT_PASSWORD, 10,
            OtpPurpose.RESET_PASSWORD, 10,
            OtpPurpose.TRANSACTION_PASSWORD, 3,
            OtpPurpose.LOGIN_2FA, 5,
            OtpPurpose.EMAIL_VERIFICATION, 30,
            OtpPurpose.PHONE_VERIFICATION, 10,
            OtpPurpose.ACCOUNT_UNLOCK, 15,
            OtpPurpose.CHANGE_MOBILE_NUMBER, 5,
            OtpPurpose.KYC_VERIFICATION, 15
    );

    private static final int DEFAULT_MAX_ATTEMPTS = 5;
    private static final int DEFAULT_MAX_RESENDS = 3;
    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private static final int OTP_LENGTH = 6;

    // =====================================================================
    // GENERATE
    // =====================================================================

    /**
     * Generates a new OTP, invalidating any previously pending OTP for the
     * same contact+purpose (prevents multiple valid OTPs floating around).
     */
    @Transactional
    public ApiResponse<OtpResponse> generateOtp(GenerateOtpRequest request) {
        validateGenerateRequest(request);

        // Invalidate any existing pending OTPs for this contact + purpose
        otpRepository.invalidateAllPending(request.getContact(), request.getPurpose());

        String rawOtp = generateNumericOtp(OTP_LENGTH);
        String hashed = hashOtp(rawOtp);

        Otp otp = new Otp();
        otp.setUserId(request.getUserId());
        otp.setContact(request.getContact());
        otp.setOtpHash(hashed);
        otp.setPurpose(request.getPurpose());
        otp.setChannel(request.getChannel());
        otp.setReferenceId(request.getReferenceId());
        otp.setStatus(OtpStatus.PENDING);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(
                EXPIRY_MINUTES.getOrDefault(request.getPurpose(), 10)));
        otp.setMaxAttempts(DEFAULT_MAX_ATTEMPTS);
        otp.setMaxResendCount(DEFAULT_MAX_RESENDS);
        otp.setIpAddress(request.getIpAddress());
        otp.setDeviceInfo(request.getDeviceInfo());
        otp.setCreatedDate(LocalDateTime.now());
        otp.setCreatedBy(safeContact(request));
        otp.setIsActive(true);

        Otp saved = otpRepository.save(otp);

        // Fire-and-forget delivery — swap for your real notification service
        dispatchOtp(saved, rawOtp);

        log.info("OTP generated: id={}, purpose={}, contact={}", saved.getId(), saved.getPurpose(), maskContact(saved.getContact()));

       // return toResponse(saved, "OTP sent successfully.");

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(List.of(request.getContact()));
        emailRequest.setSubject("OTP Verification");
        emailRequest.setHtml(EmailTemplates.otp("", rawOtp));
        emailService.sendEmailAsync(emailRequest);

        return ApiResponse.success(null,
                "OTP sent successfully.");
    }
    @Transactional
    public ApiResponse<OtpResponse> generateOtpForForgetPassword(GenerateOtpRequest request) {
        validateGenerateRequest(request);
        // Invalidate any existing pending OTPs for this contact + purpose
        otpRepository.invalidateAllPending(request.getContact(), request.getPurpose());

        String rawOtp = generateNumericOtp(OTP_LENGTH);
        String hashed = hashOtp(rawOtp);

        Otp otp = new Otp();
        otp.setUserId(request.getUserId());
        otp.setContact(request.getContact());
        otp.setOtpHash(hashed);
        otp.setPurpose(request.getPurpose());
        otp.setChannel(request.getChannel());
        otp.setReferenceId(request.getReferenceId());
        otp.setStatus(OtpStatus.PENDING);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(
                EXPIRY_MINUTES.getOrDefault(request.getPurpose(), 10)));
        otp.setMaxAttempts(DEFAULT_MAX_ATTEMPTS);
        otp.setMaxResendCount(DEFAULT_MAX_RESENDS);
        otp.setIpAddress(request.getIpAddress());
        otp.setDeviceInfo(request.getDeviceInfo());
        otp.setCreatedDate(LocalDateTime.now());
        otp.setCreatedBy(safeContact(request));
        otp.setIsActive(true);

        Otp saved = otpRepository.save(otp);

        // Fire-and-forget delivery — swap for your real notification service
        dispatchOtp(saved, rawOtp);

        log.info("OTP generated: id={}, purpose={}, contact={}", saved.getId(), saved.getPurpose(), maskContact(saved.getContact()));

        // return toResponse(saved, "OTP sent successfully.");

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(List.of(request.getContact()));
        emailRequest.setSubject("OTP Verification");
        emailRequest.setHtml(EmailTemplates.otp("", rawOtp));
        emailService.sendEmailAsync(emailRequest);

        return ApiResponse.success(null,rawOtp);
    }
    // =====================================================================
    // VERIFY
    // =====================================================================

//    @Transactional
//    public ApiResponse<VerifyOtpResponse> verifyOtp(VerifyOtpRequest request) {
//
//        VerifyOtpResponse response=new VerifyOtpResponse();
//
//        Otp otp = otpRepository
//                .findFirstByContactAndPurposeAndStatusOrderByCreatedDateDesc(
//                        request.getContact(), request.getPurpose(), OtpStatus.PENDING)
//                .orElseThrow(() -> new OtpNotFoundException(
//                        "No pending OTP found for this request. Please request a new one."));
//
//        // Reference-id binding check (e.g. transaction password tied to a specific transaction)
//        if (otp.getReferenceId() != null &&
//                !otp.getReferenceId().equals(request.getReferenceId())) {
//            throw new OtpMismatchException("OTP does not match the given reference.");
//        }
//
//        // Expiry check — lazily mark expired if needed
//        if (otp.isExpired()) {
//            otp.markExpiredIfNeeded();
//            otpRepository.save(otp);
//            throw new OtpExpiredException("OTP has expired. Please request a new one.");
//        }
//
//        // Already used check (replay protection)
//        if (otp.isUsed()) {
//            throw new OtpAlreadyUsedException("This OTP has already been used.");
//        }
//
//        // Lock check
//        if (otp.isLocked()) {
//            otpRepository.save(otp);
//            throw new OtpLockedException("Too many incorrect attempts. Please request a new OTP.");
//        }
//
//        // Compare hash
//        boolean matches = BCrypt.checkpw(request.getOtp(), otp.getOtpHash());
//        if (!matches) {
//            otp.registerFailedAttempt();
//            otpRepository.save(otp);
//
//            int remaining = otp.getMaxAttempts() - otp.getAttemptCount();
//            if (otp.isLocked()) {
//                throw new OtpLockedException("Too many incorrect attempts. Please request a new OTP.");
//            }
//            response= VerifyOtpResponse.builder()
//                    .success(false)
//                    .status(otp.getStatus())
//                    .message("Incorrect OTP. " + remaining + " attempt(s) remaining.")
//                    .attemptsRemaining(remaining)
//                    .build();
//            return ApiResponse.nodatafound(response,
//                    "Incorrect OTP. " + remaining + " attempt(s) remaining.");
//        }
//
//        // Success
//        otp.markVerified();
//        otpRepository.save(otp);
//
//        log.info("OTP verified successfully: id={}, purpose={}", otp.getId(), otp.getPurpose());
//
//        EmailRequest emailRequest = new EmailRequest();
//        emailRequest.setTo(List.of(request.getContact()));
//        emailRequest.setSubject("OTP verified successfully");
//        emailRequest.setHtml(EmailTemplates.otpVerified());
//        emailService.sendEmailAsync(emailRequest);
//
//        response= VerifyOtpResponse.builder()
//                .success(true)
//                .status(otp.getStatus())
//                .message("OTP verified successfully.")
//                .attemptsRemaining(otp.getMaxAttempts() - otp.getAttemptCount())
//                .build();
//        return ApiResponse.success(response,
//                "OTP verified successfully.");
//    }
@Transactional
public ApiResponse<VerifyOtpResponse> verifyOtp(VerifyOtpRequest request) {

    VerifyOtpResponse response;

    Optional<Otp> optionalOtp = otpRepository
            .findFirstByContactAndPurposeAndStatusOrderByCreatedDateDesc(
                    request.getContact(),
                    request.getPurpose(),
                    OtpStatus.PENDING);

    if (optionalOtp.isEmpty()) {
        return ApiResponse.failure("No pending OTP found. Please request a new OTP.");
    }

    Otp otp = optionalOtp.get();

    // Reference check
    if (otp.getReferenceId() != null &&
            !Objects.equals(otp.getReferenceId(), request.getReferenceId())) {
        return ApiResponse.failure("OTP does not match the given reference.");
    }

    // Expiry check
    if (otp.isExpired()) {
        otp.markExpiredIfNeeded();
        otpRepository.save(otp);
        return ApiResponse.failure("OTP has expired. Please request a new OTP.");
    }

    // Already used
    if (otp.isUsed()) {
        return ApiResponse.failure("This OTP has already been used.");
    }

    // Locked
    if (otp.isLocked()) {
        return ApiResponse.failure("Too many incorrect attempts. Please request a new OTP.");
    }

    // Verify OTP
    if (!BCrypt.checkpw(request.getOtp(), otp.getOtpHash())) {

        otp.registerFailedAttempt();
        otpRepository.save(otp);

        if (otp.isLocked()) {
            return ApiResponse.failure("Too many incorrect attempts. Please request a new OTP.");
        }

        int remaining = otp.getMaxAttempts() - otp.getAttemptCount();

        response = VerifyOtpResponse.builder()
                .success(false)
                .status(otp.getStatus())
                .message("Incorrect OTP.")
                .attemptsRemaining(remaining)
                .build();

        return ApiResponse.nodatafound(response,
                "Incorrect OTP. " + remaining + " attempt(s) remaining.");
    }

    // Success
    otp.markVerified();
    otpRepository.save(otp);

    log.info("OTP verified successfully: id={}, purpose={}", otp.getId(), otp.getPurpose());

    EmailRequest emailRequest = new EmailRequest();
    emailRequest.setTo(List.of(request.getContact()));
    emailRequest.setSubject("OTP verified successfully");
    emailRequest.setHtml(EmailTemplates.otpVerified());
    emailService.sendEmailAsync(emailRequest);

    response = VerifyOtpResponse.builder()
            .success(true)
            .status(otp.getStatus())
            .message("OTP verified successfully.")
            .attemptsRemaining(otp.getMaxAttempts() - otp.getAttemptCount())
            .build();

    return ApiResponse.success(response, "OTP verified successfully.");
}

    // =====================================================================
    // RESEND
    // =====================================================================

    @Transactional
    public ApiResponse<OtpResponse> resendOtp(ResendOtpRequest request) {
        OtpResponse response=new OtpResponse();
        Otp existing = otpRepository
                .findFirstByContactAndPurposeAndStatusOrderByCreatedDateDesc(
                        request.getContact(), request.getPurpose(), OtpStatus.PENDING)
                .orElse(null);

        // No pending OTP at all — just generate a fresh one
        if (existing == null) {
            GenerateOtpRequest genReq = new GenerateOtpRequest();
            genReq.setContact(request.getContact());
            genReq.setPurpose(request.getPurpose());
            genReq.setChannel(OtpChannel.SMS); // default; caller should really always pass channel explicitly
            genReq.setReferenceId(request.getReferenceId());
            genReq.setIpAddress(request.getIpAddress());
            genReq.setDeviceInfo(request.getDeviceInfo());
            return generateOtp(genReq);
        }

        if (!existing.canResend()) {
            if (existing.getResendCount() >= existing.getMaxResendCount()) {
                throw new OtpResendLimitExceededException(
                        "Maximum resend attempts reached. Please try again later.");
            }
            throw new OtpResendTooSoonException(
                    "Please wait before requesting another OTP.");
        }

        // Rotate the OTP value itself on resend (don't resend the same code)
        String rawOtp = generateNumericOtp(OTP_LENGTH);
        existing.setOtpHash(hashOtp(rawOtp));
        existing.setExpiresAt(LocalDateTime.now().plusMinutes(
                EXPIRY_MINUTES.getOrDefault(existing.getPurpose(), 10)));
        existing.setResendCount(existing.getResendCount() + 1);
        existing.setNextResendAllowedAt(LocalDateTime.now().plusSeconds(RESEND_COOLDOWN_SECONDS));
        existing.setAttemptCount(0); // reset attempts on a fresh code
        existing.setStatus(OtpStatus.PENDING);
        existing.setUpdatedDate(LocalDateTime.now());

        Otp saved = otpRepository.save(existing);
        dispatchOtp(saved, rawOtp);

        log.info("OTP resent: id={}, resendCount={}", saved.getId(), saved.getResendCount());

        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo(List.of(request.getContact()));
        emailRequest.setSubject("OTP Verification");
        emailRequest.setHtml(EmailTemplates.otp("", rawOtp));
        emailService.sendEmailAsync(emailRequest);

        response= toResponse(saved, "OTP resent successfully.");
        return ApiResponse.success(response,
                "OTP resent successfully.");
    }

    // =====================================================================
    // INVALIDATE / CANCEL (e.g. user abandons flow, or admin action)
    // =====================================================================

    @Transactional
    public void invalidateOtp(Long otpId, String contact) {
        Otp otp = otpRepository.findByIdAndContact(otpId, contact)
                .orElseThrow(() -> new OtpNotFoundException("OTP not found."));
        otp.invalidate();
        otp.setUpdatedDate(LocalDateTime.now());
        otpRepository.save(otp);
    }

    @Transactional
    public int invalidateAllPending(String contact, OtpPurpose purpose) {
        return otpRepository.invalidateAllPending(contact, purpose);
    }

    // =====================================================================
    // EXPIRE (scheduled cleanup job — call from a @Scheduled method)
    // =====================================================================

    @Transactional
    public int expireStaleOtps() {
        List<Otp> stale = otpRepository.findAllByStatusAndExpiresAtBefore(
                OtpStatus.PENDING, LocalDateTime.now());
        stale.forEach(otp -> {
            otp.setStatus(OtpStatus.EXPIRED);
            otp.setUpdatedDate(LocalDateTime.now());
        });
        otpRepository.saveAll(stale);
        if (!stale.isEmpty()) {
            log.info("Marked {} OTP(s) as EXPIRED", stale.size());
        }
        return stale.size();
    }

    // =====================================================================
    // Helpers
    // =====================================================================

    private void validateGenerateRequest(GenerateOtpRequest request) {
        if (request.getContact() == null || request.getContact().isBlank()) {
            throw new InvalidOtpRequestException("Contact (email/phone) is required.");
        }
        if (request.getPurpose() == null) {
            throw new InvalidOtpRequestException("Purpose is required.");
        }
        if (request.getChannel() == null) {
            throw new InvalidOtpRequestException("Delivery channel is required.");
        }
        if (request.getPurpose() == OtpPurpose.TRANSACTION_PASSWORD &&
                (request.getReferenceId() == null || request.getReferenceId().isBlank())) {
            throw new InvalidOtpRequestException(
                    "referenceId (transaction id) is required for TRANSACTION_PASSWORD OTPs.");
        }
    }

    private String generateNumericOtp(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(RANDOM.nextInt(10));
        }
        return sb.toString();
    }

    private String hashOtp(String rawOtp) {
        return BCrypt.hashpw(rawOtp, BCrypt.gensalt());
    }

    private void dispatchOtp(Otp otp, String rawOtp) {
        // TODO: wire to real SMS/Email/Push service, e.g.:
        // if (otp.getChannel() == OtpChannel.EMAIL) notificationService.sendEmail(...);
        // if (otp.getChannel() == OtpChannel.SMS) notificationService.sendSms(...);
        log.debug("Dispatching OTP {} to {} via {}", rawOtp, maskContact(otp.getContact()), otp.getChannel());
    }

    private String maskContact(String contact) {
        if (contact == null || contact.length() < 4) return "****";
        return contact.substring(0, 2) + "****" + contact.substring(contact.length() - 2);
    }

    private String safeContact(GenerateOtpRequest request) {
        return request.getUserId() != null ? "user:" + request.getUserId() : request.getContact();
    }

    private OtpResponse toResponse(Otp otp, String message) {
        return OtpResponse.builder()
                .otpId(otp.getId())
                .contact(otp.getContact())
                .purpose(otp.getPurpose())
                .channel(otp.getChannel())
                .status(otp.getStatus())
                .expiresAt(otp.getExpiresAt())
                .attemptsRemaining(otp.getMaxAttempts() - otp.getAttemptCount())
                .resendsRemaining(otp.getMaxResendCount() - otp.getResendCount())
                .message(message)
                .build();
    }
}