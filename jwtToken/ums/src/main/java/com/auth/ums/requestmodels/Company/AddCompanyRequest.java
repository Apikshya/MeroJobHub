package com.auth.ums.requestmodels.Company;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AddCompanyRequest {

    @JsonProperty("company_name")
    @NotBlank(message = "Company name is required")
    private String companyName;

    @JsonProperty("email_id")
    @NotBlank(message = "Email ID is required")
    private String emailId;

    @JsonProperty("phone_number")
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @JsonProperty("website")
    private String website;

    @JsonProperty("industry_type")
    @NotBlank(message = "Industry type is required")
    private String industryType;

    @JsonProperty("company_type")
    @NotBlank(message = "Company type is required")
    private String companyType;

    @JsonProperty("registration_number")
    private String registrationNumber;

    @JsonProperty("tax_number")
    private String taxNumber;

    @JsonProperty("company_size")
    @NotBlank(message = "Company size is required")
    private String companySize;

    @JsonProperty("employee_count")
    private Integer employeeCount;

    @JsonProperty("founded_year")
    @NotNull(message = "Founded year is required")
    private Integer foundedYear;

    @JsonProperty("contact_person_name")
    @NotBlank(message = "Contact person name is required")
    private String contactPersonName;

    @JsonProperty("contact_person_designation")
    @NotBlank(message = "Contact person designation is required")
    private String contactPersonDesignation;

    @JsonProperty("address")
    @NotBlank(message = "Address is required")
    private String address;

    @JsonProperty("city")
    private String city;

    @JsonProperty("state")
    private String state;

    @JsonProperty("country")
    @NotBlank(message = "Country is required")
    private String country;

    @JsonProperty("postal_code")
    private String postalCode;

    @JsonProperty("logo")
    private String logo;

    @JsonProperty("description")
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


