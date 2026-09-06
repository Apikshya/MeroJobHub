package com.auth.ums.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "profile_pictures")
@Data
public class ProfilePicture extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "is_current")
    private Boolean isCurrent = true;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
