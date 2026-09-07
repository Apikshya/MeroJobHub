package com.auth.ums.requestmodels.Auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddUserRequest {

    @NotBlank(message = "FirstName is Required ")
    private String firstName;

    private String middleName;

    @NotBlank(message = "LastName is Required ")
    private String lastName;

    @NotNull(message = "Age is Required ")
    private Integer age;

    @NotBlank(message = "Address is Required ")
    private String address;

    @NotBlank(message = "Email is Required ")
    private String email;

    @NotBlank(message = "PhoneNumber is Required ")
    private String phoneNumber;

    @NotBlank(message = "Password is Required ")
    private String password;

}

