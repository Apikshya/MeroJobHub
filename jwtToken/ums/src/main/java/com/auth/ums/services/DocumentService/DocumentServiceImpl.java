package com.auth.ums.services.DocumentService;


import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.mapper.DocumentMapper;
import com.auth.ums.models.Document;
import com.auth.ums.repository.DocumentRepository;
import com.auth.ums.repository.UserRepository;
import com.auth.ums.requestmodels.DocumentRequestModel.AddDocumentRequest;
import com.auth.ums.requestmodels.DocumentRequestModel.FileUploadResponse;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.DocumentDTO.DocumentResponse;
import com.auth.ums.services.MessageNotification.MessageNotificationService;
import com.auth.ums.utility.JsonUtils;
import com.auth.ums.utility.NotificationHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class DocumentServiceImpl implements DocumentService {
    private static final Logger log = LoggerFactory.getLogger(DocumentServiceImpl.class);

    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    MessageNotificationService notificationService;

    @Override
    public ApiResponse<DocumentResponse> addDocument(FileUploadResponse fileUploadresponse, AddDocumentRequest request) {
        DocumentResponse response = new DocumentResponse();
        try {
            log.info("Add doc request is  {}", JsonUtils.toJson(request));

            Document document = DocumentMapper.addDocument(request);

            document.setCreatedBy(jwtUtil.getCurrentUsername());
            document.setCreatedDate((LocalDateTime.now()));

            document.setFileName(fileUploadresponse.getFileName());
            document.setExtension(fileUploadresponse.getExtension());
            document.setSizeBytes(fileUploadresponse.getSizeBytes());
            document.setSizeReadable(fileUploadresponse.getSizeReadable());
            document.setMimeType(fileUploadresponse.getMimeType());
            document.setOriginalFileName(fileUploadresponse.getOriginalFileName());
            document.setFilePath(fileUploadresponse.getSavedPath());
            document.setIsActive(true);
            document.setIsDeleted((false));
            documentRepository.save(document);
            response.setDocument(DocumentMapper.toDocumentDTO(document));

            log.info("Document Added successfully, fileName={}", fileUploadresponse.getFileName());
            notificationService.push(NotificationHelper.documentUploaded(jwtUtil.getCurrentUsername(),document.getFileName()));
            return ApiResponse.success(response, "Add SuccessFully");

        } catch (Exception e) {
            log.error("Exception while add document", e.getMessage());
            return ApiResponse.exception(e.getMessage());
        }
    }

    @Override
    public ResponseEntity<Resource> viewDocument(Long id) {

        log.info("View document started. Document Id : {}", id);

        try {

            // Find document
            Document document = documentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Document not found"));

            // File path from DB
            File file = new File(document.getFilePath());

            if (!file.exists()) {
                throw new RuntimeException("File does not exist.");
            }

            Resource resource = new FileSystemResource(file);

            String mimeType = document.getMimeType();

            if (mimeType == null || mimeType.isBlank()) {
                mimeType = "application/octet-stream";
            }

            log.info("Viewing document : {}", document.getOriginalFileName());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(resource);

        } catch (Exception e) {

            log.error("View document failed", e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public ApiResponse<Document> getDocumentDetailById(Long id) {

        log.info("Finding document by file id : {}", id);

        try {

            Document document = documentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Document not found"));

            return ApiResponse.success(document, "Document found");

        } catch (Exception e) {

            log.error("Error finding document", e);
            return ApiResponse.exception(e.getMessage());
        }
    }


    @Override
    public ApiResponse<DocumentResponse> getDocumentByFileName(String fileName) {

        log.info("Find document by file name request received: fileName={}", fileName);

        DocumentResponse response = new DocumentResponse();

        Optional<Document> optional = documentRepository.findByFileName(fileName);

        if (optional.isEmpty()) {
            return ApiResponse.failure("Document not Found");
        }

        Document document = optional.get();

        if (document.getIsDeleted()) {
            return ApiResponse.failure("Document not found");
        }

        response.setDocument(DocumentMapper.toDocumentDTO(document));

        log.info("Document fetched successfully, fileName={}", fileName);

        return ApiResponse.success(response, "Fetch Successfully");
    }
    @Override
    public ApiResponse<DocumentResponse> getDocumentsByEmail(String email) {

        log.info("Find documents by email request received: email={}", email);

        DocumentResponse response = new DocumentResponse();

        List<Document> documents = documentRepository.findByCreatedBy(email);

        if (documents.isEmpty()) {
            return ApiResponse.failure("Document not Found");
        }

        List<Document> activeDocuments = documents.stream()
                .filter(document -> !document.getIsDeleted())
                .collect(Collectors.toList());

        if (activeDocuments.isEmpty()) {
            return ApiResponse.failure("Document not Found");
        }

        response.setDocuments(DocumentMapper.toDocumentDTOList(activeDocuments));

        log.info("Documents fetched successfully, email={}", email);

        return ApiResponse.success(response, "Fetch Successfully");
    }

    @Override
    public ResponseEntity<Resource> viewDocumentByFileName(String fileName) {

        log.info("Viewing document by  filename : {}", fileName);

        try {

            jwtUtil.getUserIdFromToken(userRepository);

            Document document = documentRepository.findByFileName(fileName)
                    .orElseThrow(() -> new RuntimeException("Document not found"));

            File file = new File(document.getFilePath());

            if (!file.exists()) {
                throw new RuntimeException("File does not exist.");
            }

            Resource resource = new FileSystemResource(file);

            String mimeType = document.getMimeType();

            if (mimeType == null || mimeType.isBlank()) {
                mimeType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(resource);

        } catch (Exception e) {

            log.error("View document failed", e);
            throw new RuntimeException(e.getMessage());
        }
    }
    @Override
    public ApiResponse<DocumentResponse> getBase64DocumentByFileName(String fileName) {

        log.info("Viewing document by filename : {}", fileName);

        try {

            jwtUtil.getUserIdFromToken(userRepository);

            Document document = documentRepository.findByFileName(fileName)
                    .orElseThrow(() -> new RuntimeException("Document not found"));

            File file = new File(document.getFilePath());

            if (!file.exists()) {
                throw new RuntimeException("File does not exist.");
            }

            byte[] fileBytes = Files.readAllBytes(file.toPath());

            String base64 = Base64.getEncoder().encodeToString(fileBytes);

            DocumentResponse response = new DocumentResponse();
            response.setBase64(base64);
            response.setFileName(document.getFileName());

            return ApiResponse.success(response, "Document retrieved successfully");

        } catch (Exception e) {

            log.error("View document failed", e);
            throw new RuntimeException(e.getMessage());
        }
    }

}