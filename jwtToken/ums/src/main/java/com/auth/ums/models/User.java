package com.auth.ums.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_Name",nullable = false)
    private String firstName;

    @Column(name = "middle_Name")
    private String middleName;

    @Column(name = "last_Name",nullable = false)
    private String lastName;

    @Column(name = "full_Name")
    private String fullName;

    @Column(name = "age",nullable = false)
    private Integer age;

    @Column(name = "address",nullable = false)
    private String address;

    @Column(name = "email",nullable = false,unique = true)
    private String email;

    @Column(name = "phone_Number",nullable = false,unique = true)
    private String phoneNumber;

    @Column(name = "password",nullable = false)
    private String password;

    @Column(name = "user_type")
    private String userType;

    @Column(name = "system_code")
    private String systemCode;

    @PrePersist
    @PreUpdate
    public void setFullName() {
        this.fullName = String.join(" ",
                firstName,
                middleName == null ? "" : middleName,
                lastName
        ).replaceAll("\\s+", " ").trim();
    }

}

