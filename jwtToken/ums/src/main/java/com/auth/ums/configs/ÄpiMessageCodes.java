package com.auth.ums.configs;

public enum ÄpiMessageCodes {


    // Messages
    CREATED_SUCCESSFULLY("Created successfully."), CREATION_FAILED("Creation Failed."),
    UPDATED_SUCCESSFULLY("Updated successfully."), UPDATE_FAILED("Update Failed."),
    UPLOADED_SUCCESSFULLY("Uploaded successfully."), FAILED_TO_UPLOAD_THE_FILE("Failed to upload the file."),
    DELETED_SUCCESSFULLY("Deleted successfully."), DELETION_FAILED("Deletion Failed."),
    DATA_RETRIEVED_SUCCESSFULLY("Data retrieved successfully."),
    NO_RESULT_FOUND("No result found for your requested query."),
    FETCH_SUCCESSFULLY("Fetch successfully."),
    SUCCESSFUL("Operation successfully."),
    DUPLICATE_DATA_FOUND("Duplicate data found"),
    LOGIN_RESTRICTION("The access to your accounts has been temporarily restricted."),
    LOGIN_FAILED("Invalid credentials."), LOGIN_SUCCESSFULLY("Welcome back to our GME community."),

    UNAUTHORIZED_ACCESS("You are not authorized to make this request"),

    // exceptation cases
    REQUEST_TERMINATED("Request Terminated."),


    ;

    private final String name;

    ÄpiMessageCodes(String s) {
        name = s;
    }

    public boolean equalsName(String otherName) {
        return name.equals(otherName);
    }

    public String toString() {
        return this.name;
    }
}