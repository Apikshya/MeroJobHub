package com.auth.ums.responsemodels.DocumentDTO;

import com.auth.ums.responsemodels.BaseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.UUID;

@Data
    public class DocumentDTO extends BaseDTO {

        @JsonProperty("id")
        private Long id;

        @JsonProperty("uuid")
        private UUID uuid;

        @JsonProperty("file_name")
        private String fileName;

        @JsonProperty("original_file_name")
        private String originalFileName;

        @JsonProperty("file_type")
        private String fileType;

        @JsonProperty("mime_type")
        private String mimeType;

        @JsonProperty("extension")
        private String extension;

        @JsonProperty("size_bytes")
        private Long sizeBytes;

        @JsonProperty("size_readable")
        private String sizeReadable;

        @JsonProperty("file_path")
        private String filePath;

        @JsonProperty("association_to")
        private String associationTo;

        @JsonProperty("association_id")
        private String associationId;

        @JsonProperty("description")
        private String description;
}
