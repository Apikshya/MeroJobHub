package com.auth.ums.services.DocumentService;

import com.auth.ums.models.Document;
import com.auth.ums.requestmodels.DocumentRequestModel.AddDocumentRequest;
import com.auth.ums.requestmodels.DocumentRequestModel.FileUploadResponse;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.DocumentDTO.DocumentResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;


public interface DocumentService {
    ApiResponse<DocumentResponse> addDocument(FileUploadResponse fileUploadresponse, AddDocumentRequest request);
    ApiResponse<Document> getDocumentDetailById(Long id);
    ResponseEntity<Resource> viewDocument(Long id);
    ApiResponse<DocumentResponse> getDocumentByFileName(String fileName);
    ResponseEntity<Resource> viewDocumentByFileName(String fileName);
    ApiResponse<DocumentResponse> getBase64DocumentByFileName(String fileName);
    ApiResponse<DocumentResponse> getDocumentsByEmail(String email);
}

