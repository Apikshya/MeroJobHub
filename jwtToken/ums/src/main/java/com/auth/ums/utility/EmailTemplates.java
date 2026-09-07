package com.auth.ums.utility;

public final class EmailTemplates {

    private EmailTemplates() {
    }

    public static String otp(String name, String otp) {

        return """
            <!DOCTYPE html>
            <html>

            <body style="font-family:Arial;background:#f4f4f4;padding:40px">

            <div style="
                max-width:600px;
                background:white;
                margin:auto;
                padding:30px;
                border-radius:10px">

                <h2 style="color:#1565C0">
                    OTP Verification
                </h2>

                <p>Hello <b>%s</b>,</p>

                <p>Your OTP is</p>

                <h1 style="
                    color:#1565C0;
                    letter-spacing:8px">
                    %s
                </h1>

                <p>
                    This OTP expires in 5 minutes.
                </p>

                <p>
                    Please do not share this OTP with anyone.
                </p>

                <p>
                    If you did not request this OTP or have any concerns,
                    please contact our support team.
                </p>

                <p>
                    Thank you.
                </p>

            </div>

            </body>

            </html>

            """.formatted(name, otp);

    }

    public static String otpVerified() {

        return """
            <!DOCTYPE html>
            <html>

            <body style="font-family:Arial;background:#f4f4f4;padding:40px">

            <div style="
                max-width:600px;
                background:white;
                margin:auto;
                padding:30px;
                border-radius:10px">

                <h2 style="color:#2E7D32">
                    OTP Verified Successfully
                </h2>

                <p>Dear User,</p>

                <p>
                    Your OTP has been verified successfully.
                </p>

                <div style="
                    background:#E8F5E9;
                    padding:15px;
                    border-radius:8px;
                    color:#2E7D32;
                    font-size:18px;
                    text-align:center">
                    
                    ✓ OTP Verification Completed
                </div>

                <p>
                    You can now continue with your requested action.
                </p>

                <p>
                    If you did not request this verification or believe this was done incorrectly,
                    please contact our support team.
                </p>

                <p>
                    Thank you.
                </p>

            </div>

            </body>

            </html>

            """;
    }


    public static String welcome(String name) {

        return """
                <!DOCTYPE html>
                <html>

                <body style="font-family:Arial;background:#f4f4f4;padding:40px">

                <div style="
                    max-width:600px;
                    background:white;
                    margin:auto;
                    padding:30px;
                    border-radius:10px">

                    <h2 style="color:green">
                        Welcome
                    </h2>

                    <p>Hello <b>%s</b></p>

                    <p>
                        Thank you for joining our platform.
                    </p>

                </div>

                </body>

                </html>

                """.formatted(name);

    }

    public static String accountCreatedSuccessfully(String email, String password) {

        return """
    <!DOCTYPE html>
    <html>

    <body style="font-family:Arial;background:#f4f4f4;padding:40px">

    <div style="
        max-width:600px;
        background:white;
        margin:auto;
        padding:30px;
        border-radius:10px">

        <h2 style="color:#2E7D32">
            Account Created Successfully
        </h2>

        <p>Dear User,</p>

        <p>
            Congratulations! Your account has been created successfully.
        </p>

        <div style="
            background:#E8F5E9;
            padding:15px;
            border-radius:8px;
            color:#2E7D32;
            font-size:18px;
            text-align:center">

            ✓ Your Account is Ready
        </div>

        <p>
            You can now access your account using the login credentials below:
        </p>

        <div style="
            background:#f9f9f9;
            padding:15px;
            border-radius:8px;
            border:1px solid #ddd">

            <p style="margin:5px 0">
                <b>Email:</b> %s
            </p>

            <p style="margin:5px 0">
                <b>Password:</b> %s
            </p>

        </div>

        <p>
            Please log in using these credentials and update your password
            immediately after your first login for security purposes.
        </p>

        <div style="
            background:#FFF3E0;
            padding:15px;
            border-radius:8px;
            color:#E65100">

            <b>Security Recommendation:</b><br>
            Change your temporary password after logging in to keep your account secure.
        </div>

        <p>
            If you did not create this account, please contact our support team immediately.
        </p>

        <p>
            Thank you.
        </p>

    </div>

    </body>

    </html>

    """.formatted(email, password);
    }

    public static String accountCreatedSuccessfully() {

        return """
        <!DOCTYPE html>
        <html>

        <body style="font-family:Arial;background:#f4f4f4;padding:40px">

        <div style="
            max-width:600px;
            background:white;
            margin:auto;
            padding:30px;
            border-radius:10px">

            <h2 style="color:#2E7D32">
                Account Created Successfully
            </h2>

            <p>Dear User,</p>

            <p>
                Congratulations! Your account has been created successfully.
            </p>

            <div style="
                background:#E8F5E9;
                padding:15px;
                border-radius:8px;
                color:#2E7D32;
                font-size:18px;
                text-align:center">

                ✓ Your Account is Ready
            </div>

            <p>
                You can now log in using your registered email and password.
            </p>

            <p>
                If you did not create this account, please contact our support team immediately.
            </p>

            <p>
                Thank you.
            </p>

        </div>

        </body>

        </html>

        """;
    }
    public static String passwordUpdatedSuccessfully() {

        return """
        <!DOCTYPE html>
        <html>

        <body style="font-family:Arial;background:#f4f4f4;padding:40px">

        <div style="
            max-width:600px;
            background:white;
            margin:auto;
            padding:30px;
            border-radius:10px">

            <h2 style="color:#2E7D32">
                Password Updated Successfully
            </h2>

            <p>Dear User,</p>

            <p>
                Your account password has been updated successfully.
            </p>

            <div style="
                background:#E8F5E9;
                padding:15px;
                border-radius:8px;
                color:#2E7D32;
                font-size:18px;
                text-align:center">

                ✓ Password Changed Successfully
            </div>

            <p>
                Your account is now secured with your new password.
            </p>

            <p>
                If you did not make this change, please reset your password immediately and contact our support team.
            </p>

            <p>
                Thank you.
            </p>

        </div>

        </body>

        </html>

        """;
    }
    public static String loginSuccessful() {

        return """
        <!DOCTYPE html>
        <html>

        <body style="font-family:Arial;background:#f4f4f4;padding:40px">

        <div style="
            max-width:600px;
            background:white;
            margin:auto;
            padding:30px;
            border-radius:10px">

            <h2 style="color:#2E7D32">
                Login Successful
            </h2>

            <p>Dear User,</p>

            <p>
                You have logged in to your account successfully.
            </p>

            <div style="
                background:#E8F5E9;
                padding:15px;
                border-radius:8px;
                color:#2E7D32;
                font-size:18px;
                text-align:center">

                ✓ Login Successful
            </div>

            <p>
                You can now access your account and continue using our services.
            </p>

            <p>
                If this login was not made by you, please change your password immediately and contact our support team.
            </p>

            <p>
                Thank you.
            </p>

        </div>

        </body>

        </html>

        """;
    }
    public static String jobAppliedSuccessfully() {

        return """
        <!DOCTYPE html>
        <html>

        <body style="font-family:Arial;background:#f4f4f4;padding:40px">

        <div style="
            max-width:600px;
            background:white;
            margin:auto;
            padding:30px;
            border-radius:10px">

            <h2 style="color:#2E7D32">
                Job Application Submitted Successfully
            </h2>

            <p>Dear Candidate,</p>

            <p>
                Your job application has been submitted successfully.
            </p>

            <div style="
                background:#E8F5E9;
                padding:15px;
                border-radius:8px;
                color:#2E7D32;
                font-size:18px;
                text-align:center">

                ✓ Application Submitted
            </div>

            <p>
                Our recruitment team will review your application. If your profile matches our requirements,
                you will be contacted regarding the next steps.
            </p>

            <p>
                Thank you for your interest in joining our organization.
            </p>

        </div>

        </body>

        </html>

        """;
    }
    public static String applicationShortlisted() {

        return """
        <!DOCTYPE html>
        <html>

        <body style="font-family:Arial;background:#f4f4f4;padding:40px">

        <div style="
            max-width:600px;
            background:white;
            margin:auto;
            padding:30px;
            border-radius:10px">

            <h2 style="color:#1565C0">
                Congratulations! You've Been Shortlisted
            </h2>

            <p>Dear Candidate,</p>

            <p>
                We are pleased to inform you that your application has been shortlisted.
            </p>

            <div style="
                background:#E3F2FD;
                padding:15px;
                border-radius:8px;
                color:#1565C0;
                font-size:18px;
                text-align:center">

                ✓ Application Shortlisted
            </div>

            <p>
                Our recruitment team will contact you soon with the next steps, which may include an interview or assessment.
            </p>

            <p>
                Congratulations, and thank you for your interest.
            </p>

        </div>

        </body>

        </html>

        """;
    }
    public static String applicationRejected() {

        return """
        <!DOCTYPE html>
        <html>

        <body style="font-family:Arial;background:#f4f4f4;padding:40px">

        <div style="
            max-width:600px;
            background:white;
            margin:auto;
            padding:30px;
            border-radius:10px">

            <h2 style="color:#C62828">
                Application Status Update
            </h2>

            <p>Dear Candidate,</p>

            <p>
                Thank you for taking the time to apply for the position.
            </p>

            <div style="
                background:#FFEBEE;
                padding:15px;
                border-radius:8px;
                color:#C62828;
                font-size:18px;
                text-align:center">

                Application Not Selected
            </div>

            <p>
                After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current requirements.
            </p>

            <p>
                We appreciate your interest and encourage you to apply for future opportunities.
            </p>

        </div>

        </body>

        </html>

        """;
    }
    public static String applicationSelected() {

        return """
        <!DOCTYPE html>
        <html>

        <body style="font-family:Arial;background:#f4f4f4;padding:40px">

        <div style="
            max-width:600px;
            background:white;
            margin:auto;
            padding:30px;
            border-radius:10px">

            <h2 style="color:#2E7D32">
                Congratulations! You Have Been Selected
            </h2>

            <p>Dear Candidate,</p>

            <p>
                We are delighted to inform you that you have been selected for the position.
            </p>

            <div style="
                background:#E8F5E9;
                padding:15px;
                border-radius:8px;
                color:#2E7D32;
                font-size:18px;
                text-align:center">

                ✓ Application Selected
            </div>

            <p>
                Our HR team will contact you shortly regarding the offer and onboarding process.
            </p>

            <p>
                Congratulations, and we look forward to welcoming you to our team.
            </p>

        </div>

        </body>

        </html>

        """;
    }
    public static String applicationWithdrawn() {

        return """
        <!DOCTYPE html>
        <html>

        <body style="font-family:Arial;background:#f4f4f4;padding:40px">

        <div style="
            max-width:600px;
            background:white;
            margin:auto;
            padding:30px;
            border-radius:10px">

            <h2 style="color:#EF6C00">
                Application Withdrawn
            </h2>

            <p>Dear Candidate,</p>

            <p>
                Your job application has been withdrawn successfully.
            </p>

            <div style="
                background:#FFF3E0;
                padding:15px;
                border-radius:8px;
                color:#EF6C00;
                font-size:18px;
                text-align:center">

                ✓ Application Withdrawn
            </div>

            <p>
                If this was done unintentionally, you may submit a new application if the position is still open.
            </p>

            <p>
                Thank you for your interest in our organization.
            </p>

        </div>

        </body>

        </html>

        """;
    }


}