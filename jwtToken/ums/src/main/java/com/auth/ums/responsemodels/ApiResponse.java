package com.auth.ums.responsemodels;

import com.auth.ums.configs.ApiResponseCodes;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    @NotNull
    @Enumerated(EnumType.STRING)
    private ApiResponseCodes code;

    private String message;

    private T data;

    private Instant timestamp = Instant.now(); // <-- default, always set

    // --- Explicit constructor instead of @AllArgsConstructor,
    // so 'timestamp' keeps its default and isn't forced as a param ---
    public ApiResponse(ApiResponseCodes code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        // timestamp uses field default (Instant.now())
    }

    // --- Static factory methods ---
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(ApiResponseCodes.SUCCESS, message, data);
    }

    public static <T> ApiResponse<T> failure(String message) {
        return new ApiResponse<>(ApiResponseCodes.FAILURE, message, null);
    }

    public static <T> ApiResponse<T> exception(String message) {
        return new ApiResponse<>(ApiResponseCodes.INVALID_REQUEST, message, null);
    }

    public static <T> ApiResponse<T> nodatafound(T data, String message) {
        return new ApiResponse<>(ApiResponseCodes.FAILURE, message, data);
    }

    // --- Builder Pattern ---
    public static class Builder<T> {
        private ApiResponseCodes code;
        private String message;
        private T data;
        private Instant timestamp = Instant.now();

        public Builder<T> code(ApiResponseCodes code) { this.code = code; return this; }
        public Builder<T> message(String message) { this.message = message; return this; }
        public Builder<T> data(T data) { this.data = data; return this; }

        public ApiResponse<T> build() {
            ApiResponse<T> response = new ApiResponse<>(code, message, data);
            response.setTimestamp(timestamp);
            return response;
        }
    }
}