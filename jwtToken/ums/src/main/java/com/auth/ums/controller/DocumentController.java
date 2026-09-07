package com.auth.ums.controller;

import com.auth.ums.models.Document;
import com.auth.ums.requestmodels.DocumentRequestModel.AddDocumentRequest;
import com.auth.ums.requestmodels.DocumentRequestModel.FileUploadResponse;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.DocumentDTO.DocumentResponse;
import com.auth.ums.services.DocumentService.DocumentService;
import com.auth.ums.services.DocumentService.FileService;
import com.auth.ums.utility.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;


@RestController
@RequestMapping("api/v1/document")
public class DocumentController {
    private static final Logger log = LoggerFactory.getLogger(DocumentController.class);

    @Autowired
    private DocumentService documentService;

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<DocumentResponse>> addbase64Document(@RequestBody AddDocumentRequest request) throws IOException {

        FileUploadResponse fileResponse = new FileUploadResponse();
        fileResponse = fileService.uploadBase64File(request.getBase64Data(), request.getFileName());
        //  fileResponse = fileService.uploadBase64File(request.getBase64Data());
        if (fileResponse != null) {
            log.info("Adding Base64 is starting{}", JsonUtils.toJson(request));
            return ResponseEntity.ok(documentService.addDocument(fileResponse, request));
        } else {
            log.error("Please Upload Base64 Document");
            return ResponseEntity.ok(ApiResponse.failure("Please upload document"));
        }
    }

   // @GetMapping("/details/{id}")
    //public ApiResponse<Document> getDocumentDetailById(
     //       @PathVariable Long id) {
    //    return documentService.getDocumentDetailById(id);
    //}
    @GetMapping("/view/id/{id}")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long id) {
        log.info("View document request. Id : {}", id);
        return documentService.viewDocument(id);
    }

    @GetMapping("/details/{fileName}")
    public ApiResponse<DocumentResponse> getDocumentByFileName(
            @PathVariable String fileName) {
        return documentService.getDocumentByFileName(fileName);
    }

   /// @GetMapping("/view/{fileName}")
   // public ResponseEntity<Resource> viewDocumentByOriginalFileName(
       //     @PathVariable String fileName) {
       // return documentService.viewDocumentByFileName(fileName);
  //  }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<ApiResponse<DocumentResponse>> viewDocument(
            @PathVariable String fileName) {

        ApiResponse<DocumentResponse> response =
                documentService.getBase64DocumentByFileName(fileName);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ApiResponse<DocumentResponse> getDocumentsByEmail(
            @PathVariable String email) {
        return documentService.getDocumentsByEmail(email);
    }
}
