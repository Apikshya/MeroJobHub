package com.auth.ums.utility;

import com.auth.ums.enums.NotificationAction;
import com.auth.ums.requestmodels.MessageNotification.NotificationRequest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public final class NotificationHelper {

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
    private static final String SYSTEM = "SYSTEM";

    private NotificationHelper() {
    }

    // ---------- ACCOUNT ----------

    public static NotificationRequest accountCreated(String email) {
        return NotificationRequest.builder()
                .username(email)
                .title("Account Created")
                .message("Welcome! Your account has been created successfully. You can now sign in and start exploring opportunities.")
                .action(NotificationAction.ACCOUNT_CREATED)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest newUserCreated(String adminEmail, String userEmail) {
        return NotificationRequest.builder()
                .username(adminEmail)
                .title("New User Account Created")
                .message("The account for " + userEmail + " has been created successfully.")
                .action(NotificationAction.ACCOUNT_CREATED)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest passwordChanged(String email) {
        return NotificationRequest.builder()
                .username(email)
                .title("Password Changed")
                .message("Your password has been changed successfully. If you did not perform this action, please contact support immediately.")
                .action(NotificationAction.PASSWORD_CHANGED)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest lastLogin(String email) {
        return NotificationRequest.builder()
                .username(email)
                .title("New Login Detected")
                .message("You last logged in at " + LocalDateTime.now().format(DATE_FORMAT) + ". If this wasn't you, please secure your account.")
                .action(NotificationAction.LOGIN_ALERT)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest profileUpdated(String email) {
        return NotificationRequest.builder()
                .username(email)
                .title("Profile Updated")
                .message("Your profile has been updated successfully.")
                .action(NotificationAction.PROFILE_UPDATED)
                .createdBy(SYSTEM)
                .build();
    }

    // ---------- COMPANY ----------

    public static NotificationRequest companyCreated(String email, String companyName) {
        return NotificationRequest.builder()
                .username(email)
                .title("Company Created Successfully")
                .message("Company profile '" + companyName + "' has been created successfully.")
                .action(NotificationAction.COMPANY_CREATED)
                .referenceId(companyName)
                .createdBy(SYSTEM)
                .build();
    }

    /** Notifies both admin and the company owner/user */
    public static List<NotificationRequest> companyCreated(String adminEmail, String ownerEmail, String companyName) {
        List<NotificationRequest> notifications = new ArrayList<>();
        notifications.add(companyCreated(ownerEmail, companyName));
        notifications.add(NotificationRequest.builder()
                .username(adminEmail)
                .title("New Company Registered")
                .message("Company '" + companyName + "' has been created by " + ownerEmail + ".")
                .action(NotificationAction.COMPANY_CREATED)
                .referenceId(companyName)
                .createdBy(SYSTEM)
                .build());
        return notifications;
    }

    public static NotificationRequest companyUpdated(String email, String companyName) {
        return NotificationRequest.builder()
                .username(email)
                .title("Company Details Updated")
                .message("Company profile '" + companyName + "' has been updated successfully.")
                .action(NotificationAction.COMPANY_UPDATED)
                .referenceId(companyName)
                .createdBy(SYSTEM)
                .build();
    }

    public static List<NotificationRequest> companyUpdated(String adminEmail, String ownerEmail, String companyName) {
        List<NotificationRequest> notifications = new ArrayList<>();
        notifications.add(companyUpdated(ownerEmail, companyName));
        notifications.add(NotificationRequest.builder()
                .username(adminEmail)
                .title("Company Details Updated")
                .message("Company '" + companyName + "' was updated by " + ownerEmail + ".")
                .action(NotificationAction.COMPANY_UPDATED)
                .referenceId(companyName)
                .createdBy(SYSTEM)
                .build());
        return notifications;
    }

    // ---------- JOB ----------

    public static NotificationRequest jobCreated(String email, String jobTitle) {
        return NotificationRequest.builder()
                .username(email)
                .title("Job Posted Successfully")
                .message("Job posting '" + jobTitle + "' has been created successfully.")
                .action(NotificationAction.JOB_CREATED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }

    /** Notifies admin, job owner (user), and a list of customers about a new job */
    public static List<NotificationRequest> jobCreated(String adminEmail, String ownerEmail,
                                                       List<String> customerEmails, String jobTitle) {
        List<NotificationRequest> notifications = new ArrayList<>();
        notifications.add(jobCreated(ownerEmail, jobTitle));
        notifications.add(NotificationRequest.builder()
                .username(adminEmail)
                .title("New Job Posted")
                .message("A new job '" + jobTitle + "' has been posted by " + ownerEmail + ".")
                .action(NotificationAction.JOB_CREATED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build());

        if (customerEmails != null) {
            for (String customerEmail : customerEmails) {
                notifications.add(NotificationRequest.builder()
                        .username(customerEmail)
                        .title("New Job Opportunity")
                        .message("A new job '" + jobTitle + "' matching your interests has been posted.")
                        .action(NotificationAction.JOB_CREATED)
                        .referenceId(jobTitle)
                        .createdBy(SYSTEM)
                        .build());
            }
        }
        return notifications;
    }

    public static NotificationRequest jobUpdated(String email, String jobTitle) {
        return NotificationRequest.builder()
                .username(email)
                .title("Job Details Updated")
                .message("Job posting '" + jobTitle + "' has been updated.")
                .action(NotificationAction.JOB_UPDATED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }

    public static List<NotificationRequest> jobUpdated(String adminEmail, String ownerEmail,
                                                       List<String> customerEmails, String jobTitle) {
        List<NotificationRequest> notifications = new ArrayList<>();
        notifications.add(jobUpdated(ownerEmail, jobTitle));
        notifications.add(NotificationRequest.builder()
                .username(adminEmail)
                .title("Job Details Updated")
                .message("Job '" + jobTitle + "' was updated by " + ownerEmail + ".")
                .action(NotificationAction.JOB_UPDATED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build());

        if (customerEmails != null) {
            for (String customerEmail : customerEmails) {
                notifications.add(NotificationRequest.builder()
                        .username(customerEmail)
                        .title("Job Update")
                        .message("Details for job '" + jobTitle + "' have changed. Please review the updated posting.")
                        .action(NotificationAction.JOB_UPDATED)
                        .referenceId(jobTitle)
                        .createdBy(SYSTEM)
                        .build());
            }
        }
        return notifications;
    }

    public static NotificationRequest jobExpired(String email, String jobTitle) {
        return NotificationRequest.builder()
                .username(email)
                .title("Job Posting Expired")
                .message("Your job posting '" + jobTitle + "' has expired.")
                .action(NotificationAction.JOB_EXPIRED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }

    public static List<NotificationRequest> jobExpired(String adminEmail, String ownerEmail, String jobTitle) {
        List<NotificationRequest> notifications = new ArrayList<>();
        notifications.add(jobExpired(ownerEmail, jobTitle));
        notifications.add(NotificationRequest.builder()
                .username(adminEmail)
                .title("Job Posting Expired")
                .message("Job '" + jobTitle + "' owned by " + ownerEmail + " has expired.")
                .action(NotificationAction.JOB_EXPIRED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build());
        return notifications;
    }

    // ---------- APPLICATION ----------

    public static NotificationRequest applicationSubmitted(String email, String jobTitle) {
        return NotificationRequest.builder()
                .username(email)
                .title("Application Submitted")
                .message("Your application for '" + jobTitle + "' has been submitted successfully.")
                .action(NotificationAction.APPLICATION_SUBMITTED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest applicationReceived(String email, String candidateName, String jobTitle) {
        return NotificationRequest.builder()
                .username(email)
                .title("New Job Application Received")
                .message(candidateName + " has applied for your job posting '" + jobTitle + "'.")
                .action(NotificationAction.APPLICATION_RECEIVED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }

    /** Notifies admin, job owner (user), and the applicant (customer) when a job is applied to */
    public static List<NotificationRequest> jobApplied(String adminEmail, String ownerEmail,
                                                       String applicantEmail, String applicantName,
                                                       String jobTitle) {
        List<NotificationRequest> notifications = new ArrayList<>();
        notifications.add(applicationSubmitted(applicantEmail, jobTitle));
        notifications.add(applicationReceived(ownerEmail, applicantName, jobTitle));
        notifications.add(NotificationRequest.builder()
                .username(adminEmail)
                .title("New Application Logged")
                .message(applicantName + " applied for job '" + jobTitle + "'.")
                .action(NotificationAction.APPLICATION_RECEIVED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build());
        return notifications;
    }

    public static NotificationRequest jobApplied(String email, String jobTitle) {
        return NotificationRequest.builder()
                .username(email)
                .title("Job Applied Successfully")
                .message("Your application for the job '" + jobTitle + "' has been submitted successfully.")
                .action(NotificationAction.APPLICATION_RECEIVED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }


    public static NotificationRequest applicationAccepted(String email, String jobTitle) {
        return NotificationRequest.builder()
                .username(email)
                .title("Application Accepted")
                .message("Congratulations! Your application for '" + jobTitle + "' has been accepted.")
                .action(NotificationAction.APPLICATION_ACCEPTED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest jobStatusUpdated(
            String email,
            String jobTitle,
            String status,
            NotificationAction action) {

        return NotificationRequest.builder()
                .username(email)
                .title("Application Status Updated")
                .message("The application for '" + jobTitle + "' has been updated. Current status: " + status + ".")
                .action(action)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest applicationRejected(String email, String jobTitle) {
        return NotificationRequest.builder()
                .username(email)
                .title("Application Update")
                .message("Your application for '" + jobTitle + "' was not selected for this position.")
                .action(NotificationAction.APPLICATION_REJECTED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest interviewScheduled(String email, String jobTitle) {
        return NotificationRequest.builder()
                .username(email)
                .title("Interview Scheduled")
                .message("Your interview for '" + jobTitle + "' has been scheduled. Please check the details.")
                .action(NotificationAction.INTERVIEW_SCHEDULED)
                .referenceId(jobTitle)
                .createdBy(SYSTEM)
                .build();
    }

    // ---------- DOCUMENT ----------

    public static NotificationRequest documentUploaded(String email, String fileName) {
        return NotificationRequest.builder()
                .username(email)
                .title("Document Uploaded")
                .message("Your document '" + fileName + "' has been uploaded successfully.")
                .action(NotificationAction.DOCUMENT_UPLOADED)
                .referenceId(fileName)
                .createdBy(SYSTEM)
                .build();
    }

    // ---------- GENERIC ----------

    public static NotificationRequest genericDeleted(String email, String entityName) {
        return NotificationRequest.builder()
                .username(email)
                .title("Item Deleted")
                .message(entityName + " has been deleted successfully.")
                .action(NotificationAction.GENERIC_DELETE)
                .referenceId(entityName)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest generic(String email, String title, String message) {
        return NotificationRequest.builder()
                .username(email)
                .title(title)
                .message(message)
                .action(NotificationAction.GENERIC)
                .createdBy(SYSTEM)
                .build();
    }

    public static NotificationRequest systemAlert(String email, String message) {
        return NotificationRequest.builder()
                .username(email)
                .title("System Alert")
                .message(message)
                .action(NotificationAction.SYSTEM_ALERT)
                .createdBy(SYSTEM)
                .build();
    }
}