package com.auth.ums.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="company")
@Data
public class Company extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * Unique, system-generated, immutable code identifying this company.
     * Also used by AdminUser registration to bind an admin to this company.
     */
    @Column(name = "company_code", nullable = false, unique = true, updatable = false, length = 10)
    private String companyCode;

    @Column(name = "company_name", nullable = false, length = 250)
    private String companyName;

    @Column(name = "email_id", nullable = false, unique = true, length = 150)
    private String emailId;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "website", length = 200)
    private String website;

    @Column(name = "industry_type", length = 100)
    private String industryType;

    @Column(name = "company_type", length = 100)
    private String companyType;

    @Column(name = "registration_number", length = 100)
    private String registrationNumber;

    @Column(name = "tax_number", length = 100)
    private String taxNumber;

    @Column(name = "company_size", length = 50)
    private String companySize;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(name = "founded_year")
    private Integer foundedYear;

    @Column(name = "contact_person_name", length = 150)
    private String contactPersonName;

    @Column(name = "contact_person_designation", length = 100)
    private String contactPersonDesignation;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "logo", length = 500)
    private String logo;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(name = "facebook_url", length = 255)
    private String facebookUrl;

    @Column(name = "twitter_url", length = 255)
    private String twitterUrl;
}
