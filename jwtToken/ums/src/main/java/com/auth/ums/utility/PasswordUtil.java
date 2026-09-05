package com.auth.ums.utility;

import java.security.SecureRandom;

public class PasswordUtil {

    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateRandomPassword() {
        int password = 10000000 + RANDOM.nextInt(90000000);
        return String.valueOf(password);
    }
}