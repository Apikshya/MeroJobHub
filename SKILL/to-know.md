## In-App Notifications
Tool / Mechanism: Custom Database-Backed In-App Notification System 
(no third-party push services like Firebase or Pusher; it uses Spring Boot + PostgreSQL).

## Key Components:

NotificationHelper.java
: A factory class generating standardized notification payloads for system events (ACCOUNT_CREATED, LOGIN_ALERT, PASSWORD_CHANGED, JOB_APPLIED, JOB_CREATED, etc.).


MessageNotificationServiceImpl.java
: Saves notification records into the PostgreSQL table message_notification with title, message, action, user email, and read status (UNREAD).


NotificationController.java
: Exposes REST endpoints (/api/v1/notification/get-my-notifications, /mark-as-read/{id}, /mark-all-as-read).
Flow: $$\text{Action Triggered (e.g., Job Applied)} \longrightarrow \text{NotificationHelper builds payload} \longrightarrow \text{Saved in DB as UNREAD} \longrightarrow \text{Frontend polls/fetches via REST API}$$


## Sending Password & Credentials on Email
Tool / Mechanism: Spring Boot Starter Mail (JavaMailSender) + Jakarta Mail (MimeMessageHelper) connecting via Gmail SMTP.
Configuration: In 

application.properties
:
Host: smtp.gmail.com (Port 587, TLS enabled)
Authenticated using a Gmail App Password.
Key Components:


EmailTemplates.java
: Formats HTML email templates (such as accountCreatedSuccessfully(email, password) and OTP templates).


EmailServiceImpl.java
: Sends the email asynchronously using Spring's @Async("emailTaskExecutor") so HTTP requests are not blocked while the email is being dispatched.
Flow (User Registration / Creation):
Admin/User signs up or registers a new account in 

UserServiceImpl.java
.
The service creates an HTML template populated with the user's email and initial plain-text password.
emailService.sendEmailAsync(emailRequest) queues and sends the email via Gmail SMTP in a background thread.
The password is then hashed with <mark>BCryptPasswordEncoder</mark> and stored securely in the database.


## Image Storage (Profile Pictures & Documents)
Tool / Storage Medium: Spring Web MultipartFile saved to the <mark>Local File System (Server Disk) + PostgreSQL for metadata.</mark>
Storage Path: Configured via file.upload.profile-picture-path in application.properties (e.g., .../resources/profilepic/Image).
Key Components:


ProfilePictureController.java
: Accepts multipart/form-data uploads at /api/v1/profile-picture/upload.


ProfilePictureServiceImpl.java
: Handles folder creation, file transfer, and DB indexing.
Flow:
Frontend submits an image via multipart/form-data.
The server extracts the authenticated userId from the JWT token and deactivates any existing profile picture for that user in the DB.
The server ensures a directory exists on disk for that user: {baseDir}/{userId}/.
A unique filename is generated using a UUID (UUID.randomUUID() + "_" + originalFilename) to prevent collisions.
The image binary is written directly to disk via file.transferTo(new File(filePath)).
A record containing the filename, disk path, active state (isCurrent = true), and user relation is saved in the profile_picture database table.