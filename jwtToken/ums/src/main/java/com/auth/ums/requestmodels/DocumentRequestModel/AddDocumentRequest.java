package com.auth.ums.requestmodels.DocumentRequestModel;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddDocumentRequest {
    @NotBlank(message = "FileName is required ")
    private String fileName;

    @NotBlank(message = "FileType is required")
    private String fileType;

    private String associationTo;

    private String associationId;

    private String associationType;

    private String base64Data;

}
