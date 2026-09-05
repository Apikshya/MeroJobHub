package com.auth.ums.configs;

public enum ApiResponseCodes {
    SUCCESS("SUCCESS"),
    FAILURE("FAILURE"),

    INVALID_REQUEST("INVALID_REQUEST"),
    NOT_AUTHORIZED("NOT_AUTHORIZED"),	;

    private final String name;

    ApiResponseCodes(String s) {
        name = s;
    }

    public boolean equalsName(String otherName) {
        return name.equals(otherName);
    }

    public String toString() {
        return this.name;
    }
}
