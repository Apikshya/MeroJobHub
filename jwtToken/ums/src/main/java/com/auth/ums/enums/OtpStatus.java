package com.auth.ums.enums;

public enum OtpStatus {
    PENDING,     // generated, not yet verified
    VERIFIED,    // successfully used
    EXPIRED,     // expired without being used
    LOCKED,      // too many failed attempts
    INVALIDATED, // manually revoked / superseded by a newer OTP
    CANCELLED    // e.g. user changed flow before verifying
}

