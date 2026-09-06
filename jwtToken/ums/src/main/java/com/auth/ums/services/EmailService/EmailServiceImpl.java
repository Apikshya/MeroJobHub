package com.auth.ums.services.EmailService;

import com.auth.ums.exceptions.EmailException;
import com.auth.ums.requestmodels.Emails.EmailAttachment;
import com.auth.ums.requestmodels.Emails.EmailRequest;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Override
    public void sendEmail(EmailRequest request) {

        try {

            log.info("Sending email. Subject={}", request.getSubject());

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(from);

            helper.setSubject(request.getSubject());

            helper.setText(request.getHtml(), true);

            if (request.getTo() != null && !request.getTo().isEmpty()) {
                helper.setTo(request.getTo().toArray(new String[0]));
            }

            if (request.getCc() != null && !request.getCc().isEmpty()) {
                helper.setCc(request.getCc().toArray(new String[0]));
            }

            if (request.getBcc() != null && !request.getBcc().isEmpty()) {
                helper.setBcc(request.getBcc().toArray(new String[0]));
            }

            if (request.getReplyTo() != null) {
                helper.setReplyTo(request.getReplyTo());
            }

            if (request.getAttachments() != null) {

                for (EmailAttachment attachment : request.getAttachments()) {

                    helper.addAttachment(
                            attachment.getFileName(),
                            attachment.getResource()
                    );

                }
            }

            mailSender.send(message);

            log.info("Email sent successfully.");

        } catch (Exception ex) {

            log.error("Email sending failed.", ex);

            throw new EmailException("Unable to send email.", ex);

        }

    }


    @Override
    @Async("emailTaskExecutor")
    public void sendEmailAsync(EmailRequest request) {
        try {
            sendEmail(request);
        }
        catch (Exception ex) {
            log.error("Failed to send email asynchronously. Subject={}",
                    request.getSubject(), ex);

            // Optional:
            // Save to EmailLog table
            // Retry later
            // Send to Kafka/RabbitMQ
        }
    }

}
