package com.auth.ums.requestmodels.DocumentRequestModel;

import lombok.Data;

@Data
public class FileUploadResponse {
    private String originalFileName;
    private String fileName;
    private String extension;
    private long sizeBytes;
    private String sizeReadable;
    private String mimeType;
    private String savedPath;

    public FileUploadResponse(String fileName, String extension, long sizeBytes,
                              String sizeReadable, String mimeType, String savedPath,String originalFileName) {
        this.fileName = fileName;
        this.extension = extension;
        this.sizeBytes = sizeBytes;
        this.sizeReadable = sizeReadable;
        this.mimeType = mimeType;
        this.savedPath = savedPath;
        this.originalFileName=originalFileName;
    }
    public FileUploadResponse() {
    }
}
