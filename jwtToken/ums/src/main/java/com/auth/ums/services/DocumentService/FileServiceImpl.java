package com.auth.ums.services.DocumentService;

import com.auth.ums.requestmodels.DocumentRequestModel.FileUploadResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {
    private static final Logger log = LoggerFactory.getLogger(FileServiceImpl.class);

    // Base directory path where files will be stored, injected from application.properties
    @Value("${filePath}")
    private String basePath;


    @Override
    public FileUploadResponse uploadBase64File(String base64, String originalName) throws IOException {

        if (originalName == null || originalName.trim().isEmpty()) {
            System.out.println("INVALID_NAME");
            log.error("INVALID_NAME");
            return null;
        }

        // Extract file extension
        String extension = "";
        int dotIndex = originalName.lastIndexOf(".");
        if (dotIndex != -1) {
            extension = originalName.substring(dotIndex + 1);
        } // Create a unique filename
        String newFileName = UUID.randomUUID().toString() + "_" + originalName;

        // Decode Base64 to bytes
        byte[] fileBytes = Base64.getDecoder().decode(base64);

        // Ensure directory exists
        File directory = new File(basePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Full file path
        String fullPath = basePath + newFileName;

        // Write bytes to file
        try (FileOutputStream fos = new FileOutputStream(fullPath)) {
            fos.write(fileBytes);
        }

        // Get file size
        long sizeBytes = fileBytes.length;
        String sizeReadable = readableFileSize(sizeBytes);

        // Return FileUploadResponse (same structure as Multipart upload)
        return new FileUploadResponse(
                newFileName,        // new unique filename
                extension,          // file extension
                sizeBytes,          // size in bytes
                sizeReadable,       // size in readable format
                "application/octet-stream", // no mime from base64 → default
                fullPath,           // saved file full path
                originalName        // original client file name
        );
    }

    private String readableFileSize(long size) {
        if (size <= 0) return "0 B";
        final String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return String.format("%.2f %s", size / Math.pow(1024, digitGroups), units[digitGroups]);
    }
}
