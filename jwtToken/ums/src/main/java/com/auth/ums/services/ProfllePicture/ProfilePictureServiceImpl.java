package com.auth.ums.services.ProfllePicture;

import com.auth.ums.jwtsecurity.JwtUtil;
import com.auth.ums.mapper.ProfilePictureMapper;
import com.auth.ums.models.ProfilePicture;
import com.auth.ums.models.User;
import com.auth.ums.repository.ProfilePictureRepository;
import com.auth.ums.repository.UserRepository;
import com.auth.ums.responsemodels.ApiResponse;
import com.auth.ums.responsemodels.ProfilePicture.ProfilePictureResponse;
import com.auth.ums.utility.JsonUtils;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class ProfilePictureServiceImpl implements ProfilePictureService {
    private static final Logger log = LoggerFactory.getLogger(ProfilePictureServiceImpl.class);

    @Value("${file.upload.profile-picture-path}")
    private String baseDir;


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfilePictureRepository profilePictureRepository;

    @Override
    public ApiResponse<ProfilePictureResponse> uploadProfilePicture(MultipartFile file) {
        log.info("Profile picture upload started");
        try {
            // 🔐 Get userId from JWT
            Long userId = jwtUtil.getUserIdFromToken(userRepository);
            log.debug("Extracted userId from token: {}", JsonUtils.toJson(userId));
            if (userId == null) {
                log.warn("Invalid JWT token - userId is null");
                return ApiResponse.failure("Invalid token");
            }

            User user = userRepository.findById(userId)

                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 🔄 Deactivate old profile pictures
            profilePictureRepository.deactivateOldProfilePictures(userId);
            log.info("Old profile pictures deactivated for userId {}",JsonUtils.toJson(userId));

            // 📁 Create user folder
            String safeBaseDir = (baseDir.endsWith("/") || baseDir.endsWith("\\")) ? baseDir : baseDir + File.separator;
            String userDir = safeBaseDir + userId + File.separator;
            File dir = new File(userDir);
            if (!dir.exists()) dir.mkdirs();

            // 🖼 Save file
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = userDir + fileName;
            file.transferTo(new File(filePath));
            log.info("Profile picture saved at {}",JsonUtils.toJson(fileName));

            // 💾 Save DB record
            ProfilePicture picture = new ProfilePicture();
            picture.setFileName(fileName);
            picture.setFilePath(filePath);
            picture.setIsCurrent(true);
            picture.setCreatedDate(LocalDateTime.now());
            picture.setIsActive(true);
            picture.setIsDeleted(false);
            picture.setCreatedBy(jwtUtil.getCurrentUsername());
            picture.setUser(user);

            profilePictureRepository.save(picture);
            log.info("Profile picture record saved in DB for userId {}", JsonUtils.toJson(picture));

            // 📦 Response
            ProfilePictureResponse response = new ProfilePictureResponse();
            response.setMessage("Profile picture uploaded successfully");
            response.setProfilePicture(ProfilePictureMapper.toDto(picture));

            return ApiResponse.success(response, "Upload success");

        } catch (Exception e) {
            log.error("Upload failed: {}",e.getMessage(),e);
            return ApiResponse.failure("Profile picture upload failed");
        }
    }

    @Override
    public ApiResponse<ProfilePictureResponse> deleteProfilePicture() {
        log.info("🗑 PROFILE DELETE STARTED");

        try {
            Long userId = jwtUtil.getUserIdFromToken(userRepository);
            log.info("JWT extracted userId = {}", userId);

            if (userId == null) {
                return ApiResponse.failure("Invalid token");
            }

            ProfilePicture picture = profilePictureRepository.getCurrentProfilePicture(userId);

            // ❌ No active profile picture
            if (picture == null) {
                log.warn("No active profile picture found for userId={}", userId);
                return ApiResponse.failure("Profile picture already deleted");
            }

            // 🗑 Delete file
            File file = new File(picture.getFilePath());
            if (file.exists()) {
                file.delete();
            }

            // 🔄 Mark as false
            picture.setIsCurrent(false);
            picture.setIsDeleted(true);
            picture.setIsActive(false);
            picture.setUpdatedDate(LocalDateTime.now());
            picture.setUpdatedBy(jwtUtil.getCurrentUsername());
            profilePictureRepository.save(picture);

            log.info("🗑 PROFILE DELETE SUCCESS :{}",JsonUtils.toJson(picture));
            return ApiResponse.success(null,"Profile picture deleted successfully");

        } catch (Exception e) {
            log.error("Delete error :{}",e.getMessage(),e);
            return ApiResponse.failure("Delete failed");
        }
    }

    @Override
    public ResponseEntity<Resource> viewProfilePicture(Long userId) {
        log.info("View profile picture request for userId: {}", userId);
        try {
            if (userId == null) {
                return ResponseEntity.badRequest().build();
            }

            ProfilePicture picture = profilePictureRepository.getCurrentProfilePicture(userId);
            if (picture == null || picture.getFilePath() == null) {
                return ResponseEntity.notFound().build();
            }

            File file = new File(picture.getFilePath());
            if (!file.exists()) {
                log.warn("Profile picture file does not exist at path: {}", picture.getFilePath());
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(file);
            String contentType = Files.probeContentType(file.toPath());
            if (contentType == null || contentType.isBlank()) {
                contentType = MediaType.IMAGE_JPEG_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            log.error("Failed to view profile picture for userId {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ApiResponse<ProfilePictureResponse> getCurrentProfilePicture() {
        try {
            Long userId = jwtUtil.getUserIdFromToken(userRepository);
            if (userId == null) {
                return ApiResponse.failure("Invalid token");
            }

            ProfilePicture picture = profilePictureRepository.getCurrentProfilePicture(userId);
            if (picture == null) {
                return ApiResponse.failure("No profile picture found");
            }

            ProfilePictureResponse response = new ProfilePictureResponse();
            response.setMessage("Profile picture fetched successfully");
            response.setProfilePicture(ProfilePictureMapper.toDto(picture));

            return ApiResponse.success(response, "Success");
        } catch (Exception e) {
            log.error("Failed to get current profile picture: {}", e.getMessage(), e);
            return ApiResponse.failure("Failed to get profile picture");
        }
    }
}
