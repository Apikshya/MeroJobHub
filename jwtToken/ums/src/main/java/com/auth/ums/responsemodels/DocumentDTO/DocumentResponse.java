package com.auth.ums.responsemodels.DocumentDTO;

import com.auth.ums.responsemodels.user.UserDto;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentResponse {

    @JsonProperty("document")
    private DocumentDTO document;

    @JsonProperty("documents")
    private List<DocumentDTO> documents;

    @JsonProperty("base64")
    private String base64;

    @JsonProperty("file_name")
    private String fileName;
}