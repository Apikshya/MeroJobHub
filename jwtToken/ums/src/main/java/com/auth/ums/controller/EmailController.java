package com.auth.ums.controller;

import com.auth.ums.requestmodels.Emails.EmailRequest;
import com.auth.ums.services.EmailService.EmailService;
import com.auth.ums.utility.EmailTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    /**
     * Send email from request body
     */
    @PostMapping(value = "/send", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> sendEmail(
            @RequestPart("request") EmailRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        emailService.sendEmailAsync(request);

        return ResponseEntity.ok("Email sent successfully.");
    }


    /**
     * Test OTP Email
     */
    @GetMapping("/otp")
    public ResponseEntity<String> sendOtpEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "John") String name,
            @RequestParam(defaultValue = "123456") String otp) {

        EmailRequest request = EmailRequest.builder()
                .to(List.of(email))
                .subject("OTP Verification")
                .html(EmailTemplates.otp(name, otp))
                .build();

        emailService.sendEmailAsync(request);

        return ResponseEntity.ok("OTP Email Sent Successfully to " + email);
    }


    /**
     * Test Welcome Email
     */
    @GetMapping("/welcome")
    public ResponseEntity<String> sendWelcomeEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "User") String name) {

        EmailRequest request = EmailRequest.builder()
                .to(List.of(email))
                .subject("Welcome")
                .html(EmailTemplates.welcome(name))
                .build();

        emailService.sendEmailAsync(request);

        return ResponseEntity.ok(
                "Welcome Email Sent Successfully to " + email
        );
    }


    /**
     * Test Email With Attachment
     */
    @GetMapping("/attachment")
    public ResponseEntity<String> sendAttachmentEmail() {

        FileSystemResource resource =
                new FileSystemResource("D:/invoice.pdf");

        EmailRequest request = EmailRequest.builder()
                .to(List.of("receiver@gmail.com"))
                .subject("Invoice")
                .html(EmailTemplates.welcome("John"))
                .attachments(List.of(
                        com.auth.ums.requestmodels.Emails.EmailAttachment.builder()
                                .fileName("invoice.pdf")
                                .resource(resource)
                                .build()
                ))
                .build();

        emailService.sendEmailAsync(request);

        return ResponseEntity.ok("Attachment Email Sent.");
    }

}
