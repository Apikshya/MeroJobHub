package com.auth.ums.responsemodels.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserDto {
    private Long id;

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("middle_name")
    private String middleName;

    @JsonProperty("last_name")
    private String lastName;

    @JsonProperty("full_name")
    private String fullName;

    private Integer age;
    private String address;
    private String email;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("user_type")
    private String userType;

    @JsonProperty("system_code")
    private String systemCode;

}
