package com.auth.ums.responsemodels.Company;

import com.auth.ums.responsemodels.BaseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CompanyDTO extends BaseDTO{

    @JsonProperty("id")
    private Long id;

    @JsonProperty("company_code")
    private String companyCode;

    @JsonProperty("company_name")
    private String companyName;

    @JsonProperty("email_id")
    private String emailId;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("website")
    private String website;

    @JsonProperty("industry_type")
    private String industryType;

    @JsonProperty("company_type")
    private String companyType;

    @JsonProperty("registration_number")
    private String registrationNumber;

    @JsonProperty("tax_number")
    private String taxNumber;

    @JsonProperty("company_size")
    private String companySize;

    @JsonProperty("employee_count")
    private Integer employeeCount;

    @JsonProperty("founded_year")
    private Integer foundedYear;

    @JsonProperty("contact_person_name")
    private String contactPersonName;

    @JsonProperty("contact_person_designation")
    private String contactPersonDesignation;

    @JsonProperty("address")
    private String address;

    @JsonProperty("city")
    private String city;

    @JsonProperty("state")
    private String state;

    @JsonProperty("country")
    private String country;

    @JsonProperty("postal_code")
    private String postalCode;

    @JsonProperty("logo")
    private String logo;

    @JsonProperty("description")
    private String description;

    @JsonProperty("linkedin_url")
    private String linkedinUrl;

    @JsonProperty("facebook_url")
    private String facebookUrl;

    @JsonProperty("twitter_url")
    private String twitterUrl;
}
