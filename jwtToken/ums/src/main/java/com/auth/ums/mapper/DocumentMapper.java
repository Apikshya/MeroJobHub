package com.auth.ums.mapper;
import com.auth.ums.models.Document;
import com.auth.ums.requestmodels.DocumentRequestModel.AddDocumentRequest;
import com.auth.ums.requestmodels.DocumentRequestModel.UpdateDocumentRequest;
import com.auth.ums.responsemodels.DocumentDTO.DocumentDTO;

import java.util.List;
import java.util.stream.Collectors;


public class DocumentMapper {
    public static Document addDocument(AddDocumentRequest request) {
        Document document = new Document();
        document.setFileName(request.getFileName());
        document.setFileType(request.getFileType());
        document.setAssociationTo(request.getAssociationTo());
        document.setAssociationId(request.getAssociationId());
        document.setAssociationType(request.getAssociationType());
        return document;
    }
    public static Document updateDocument( Document document , UpdateDocumentRequest request) {
        document.setFileType(request.getFileType());
        document.setAssociationTo(request.getAssociationTo());
        document.setAssociationId(request.getAssociationId());
        document.setAssociationType(request.getAssociationType());
        return document;
    }
    public static DocumentDTO toDocumentDTO(Document document) {
        if (document == null) {
            return null;
        }

        DocumentDTO dto = new DocumentDTO();

        dto.setId(document.getId());
        dto.setUuid(document.getUuid());
        dto.setFileName(document.getFileName());
        dto.setOriginalFileName(document.getOriginalFileName());
        dto.setFileType(document.getFileType());
        dto.setMimeType(document.getMimeType());
        dto.setExtension(document.getExtension());
        dto.setSizeBytes(document.getSizeBytes());
        dto.setSizeReadable(document.getSizeReadable());
        dto.setFilePath(document.getFilePath());
        dto.setAssociationTo(document.getAssociationTo());
        dto.setAssociationId(document.getAssociationId());
        dto.setDescription(document.getDescription());

        return dto;
    }
    // List<Document> → List<DocumentDTO>
    public static List<DocumentDTO> toDocumentDTOList(List<Document> documents) {
        if (documents == null) {
            return List.of();
        }

        return documents.stream()
                .map(DocumentMapper::toDocumentDTO)
                .collect(Collectors.toList());
    }
}
