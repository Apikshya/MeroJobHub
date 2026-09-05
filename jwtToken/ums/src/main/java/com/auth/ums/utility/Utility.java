package com.auth.ums.utility;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Utility {
        // Returns a default username
        public static String getDefaultUsername() {
            return "SYSTEM";
        }

        // Returns today's date (YYYY-MM-DD)
        public static LocalDate getCurrentDate() {
            return LocalDate.now();
        }

        // Returns current date & time (YYYY-MM-DDTHH:MM:SS)
        public static LocalDateTime getCurrentDateTime() {
            return LocalDateTime.now();
        }

    public static NameParts splitFullName(String fullName) {

        NameParts nameParts = new NameParts();

        if (fullName == null || fullName.trim().isEmpty()) {
            return nameParts;
        }

        String[] names = fullName.trim().split("\\s+");

        if (names.length == 1) {
            nameParts.setFirstName(names[0]);

        } else if (names.length == 2) {
            nameParts.setFirstName(names[0]);
            nameParts.setLastName(names[1]);

        } else {
            nameParts.setFirstName(names[0]);
            nameParts.setLastName(names[names.length - 1]);

            StringBuilder middle = new StringBuilder();

            for (int i = 1; i < names.length - 1; i++) {
                middle.append(names[i]).append(" ");
            }

            nameParts.setMiddleName(middle.toString().trim());
        }

        return nameParts;
    }
    }


