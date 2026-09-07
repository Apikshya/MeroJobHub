package com.auth.ums.repository;

import com.auth.ums.enums.OtpPurpose;
import com.auth.ums.enums.OtpStatus;
import com.auth.ums.models.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {

    // Latest active/pending OTP for a contact + purpose (used before generating a new one)
    Optional<Otp> findFirstByContactAndPurposeAndStatusOrderByCreatedDateDesc(
            String contact, OtpPurpose purpose, OtpStatus status);

    // All pending OTPs for a contact+purpose (to bulk-invalidate old ones)
    List<Otp> findAllByContactAndPurposeAndStatus(
            String contact, OtpPurpose purpose, OtpStatus status);

    // Lookup by reference id (e.g. transaction id) — for TRANSACTION_PASSWORD flows
    Optional<Otp> findFirstByReferenceIdAndPurposeAndStatusOrderByCreatedDateDesc(
            String referenceId, OtpPurpose purpose, OtpStatus status);

    // For rate-limiting: count OTPs generated for a contact in a time window
    long countByContactAndPurposeAndCreatedDateAfter(
            String contact, OtpPurpose purpose, LocalDateTime since);

    // Batch job: find all PENDING rows that are already past expiry to mark EXPIRED
    List<Otp> findAllByStatusAndExpiresAtBefore(OtpStatus status, LocalDateTime now);

    // Bulk invalidate all pending OTPs for a contact+purpose in one shot
    @Modifying
    @Query("UPDATE Otp o SET o.status = 'INVALIDATED', o.isActive = false " +
            "WHERE o.contact = :contact AND o.purpose = :purpose AND o.status = 'PENDING'")
    int invalidateAllPending(@Param("contact") String contact, @Param("purpose") OtpPurpose purpose);

    Optional<Otp> findByIdAndContact(Long id, String contact);
}