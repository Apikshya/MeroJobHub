package com.auth.ums.requestmodels.DocumentRequestModel;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateDocumentRequest {
    @NotBlank(message = "ID is Required")
    private long id;

    @NotBlank(message = "FileType is Required")
    private String fileType;

    @NotBlank(message = "AssociationTo is Required")
    private String associationTo;

    @NotBlank(message = "AssociationId is Required")
    private String associationId;

    private String associationType;


}
