package com.auth.ums.requestmodels.Auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRequest {

    private Long id;

    @NotBlank(message = "FirstName is Required ")
    @JsonProperty("first_Name")
    private String firstName;

    @JsonProperty("middle_Name")
    private String middleName;

    @NotBlank(message = "LastName is Required ")
    @JsonProperty("last_Name")
    private String lastName;

    @NotNull(message = "Age is Required ")
    @JsonProperty("age")
    private Integer age;

    @NotBlank(message = "Address is Required ")
    @JsonProperty("address")
    private String address;

    @NotBlank(message = "PhoneNumber is Required ")
    @JsonProperty("phone_Number")
    private String phoneNumber;
}
