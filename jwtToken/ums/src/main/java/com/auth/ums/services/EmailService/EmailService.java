package com.auth.ums.services.EmailService;

import com.auth.ums.requestmodels.Emails.EmailRequest;

public interface EmailService {

    void sendEmail(EmailRequest request);

    void sendEmailAsync(EmailRequest request);
}
