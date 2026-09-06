package com.auth.ums.services.DocumentService;

import com.auth.ums.requestmodels.DocumentRequestModel.FileUploadResponse;

import java.io.IOException;

public interface FileService {
    FileUploadResponse uploadBase64File(String base64, String originalName) throws IOException;
}
