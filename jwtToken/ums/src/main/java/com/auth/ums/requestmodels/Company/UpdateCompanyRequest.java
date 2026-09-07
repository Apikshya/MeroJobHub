package com.auth.ums.requestmodels.Company;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateCompanyRequest {

    private Long id;

    @JsonProperty("company_name")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    private String companyName;

    @JsonProperty("email_id")
    @Email(message = "Invalid email address")
    private String emailId;

    @JsonProperty("phone_number")
//    @Pattern(
//            regexp = "^[0-9+\\-()\\s]{7,20}$",
//            message = "Invalid phone number"
//    )
    private String phoneNumber;

//    @JsonProperty("website")
//    @Pattern(
//            regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}.*$",
//            message = "Invalid website URL"
//    )
    private String website;

    @JsonProperty("industry_type")
    @Size(max = 100, message = "Industry type must not exceed 100 characters")
    private String industryType;

    @JsonProperty("company_type")
    @Size(max = 100, message = "Company type must not exceed 100 characters")
    private String companyType;

    @JsonProperty("registration_number")
    private String registrationNumber;

    @JsonProperty("tax_number")
    private String taxNumber;

    @JsonProperty("company_size")
    private String companySize;

    @JsonProperty("employee_count")
    @Min(value = 1, message = "Employee count must be greater than 0")
    private Integer employeeCount;

    @JsonProperty("founded_year")
    @Min(value = 1800, message = "Founded year must be valid")
    @Max(value = 2100, message = "Founded year must be valid")
    private Integer foundedYear;

    @JsonProperty("contact_person_name")
    @Size(min = 2, max = 100, message = "Contact person name must be between 2 and 100 characters")
    private String contactPersonName;

    @JsonProperty("contact_person_designation")
    @Size(max = 100, message = "Contact person designation must not exceed 100 characters")
    private String contactPersonDesignation;

    @JsonProperty("address")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    @JsonProperty("city")
    private String city;

    @JsonProperty("state")
    private String state;

    @JsonProperty("country")
    private String country;

    private String postalCode;

    @JsonProperty("logo")
    private String logo;

    @JsonProperty("description")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @JsonProperty("linkedin_url")
//    @Pattern(
//            regexp = "^(https?://)?(www\\.)?linkedin\\.com/.*$",
//            message = "Invalid LinkedIn URL"
//    )
    private String linkedinUrl;

    @JsonProperty("facebook_url")
//    @Pattern(
//            regexp = "^(https?://)?(www\\.)?facebook\\.com/.*$",
//            message = "Invalid Facebook URL"
//    )
    private String facebookUrl;

    @JsonProperty("twitter_url")
//    @Pattern(
//            regexp = "^(https?://)?(www\\.)?(twitter|x)\\.com/.*$",
//            message = "Invalid Twitter/X URL"
//    )
    private String twitterUrl;
}

