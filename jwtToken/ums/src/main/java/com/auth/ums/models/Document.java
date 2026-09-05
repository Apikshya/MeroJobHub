package com.auth.ums.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name="document")
@Data
public class Document extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id")
    private long id;

    @Column(name = "extension")
    private String extension;

    @Column(name = "size_bytes")
    private long sizeBytes;

    @Column(name = "size_readable")
    private String sizeReadable;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "original_file_name")
    private String originalFileName;

    @Column(name = "uuid", unique = true, nullable = false, updatable = false)
    private UUID uuid = UUID.randomUUID();

    @Column(name = "file_Name", nullable = false)
    private String fileName;

    @Column(name = "file_Type", nullable = false)
    private String fileType;

    @Column(name = "association_to")//user
    private String associationTo;

    @Column(name = "association_id")//user ko id
    private String associationId;

    @Column(name = "association_type")//profile
    private String associationType;


    @Column(name = "description")
    private String description;

    @Column(name = "file_Data")
    private String fileData;

    @Column(name = "file_Path", nullable = false)
    private String filePath;

}


