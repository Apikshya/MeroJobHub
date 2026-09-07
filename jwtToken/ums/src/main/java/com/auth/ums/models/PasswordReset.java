package com.auth.ums.models;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "password_reset")
public class PasswordReset extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "uuid", unique = true, nullable = false, updatable = false)
    private UUID uuid = UUID.randomUUID();

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "new_Password")
    private String newPassword;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "token_expiration_time")
    private LocalDateTime tokenExpirationTime;

    @Column(name = "request_time", insertable = false, updatable = false)
    private LocalDateTime requestTime;

    @Column(name = "request_ip_address")
    private String requestIpAddress;

    @Column(name = "reset_time")
    private LocalDateTime resetTime;

    @Column(name = "reset_ip_address")
    private String resetIpAddress;

    @Column(name = "reset_method")
    private String resetMethod; // EMAIL, PHONE_NUMBER

    @Column(name = "reset_source")
    private String resetSource;

    @Column(name = "additional_info")
    private String additionalInfo;

    @Column(name = "status", nullable = false)
    private String status; // ACTIVE, INACTIVE, USED, EXPIRED

}
