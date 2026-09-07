package com.auth.ums.repository;

import com.auth.ums.models.ProfilePicture;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProfilePictureRepository extends JpaRepository<ProfilePicture, Long> {

    List<ProfilePicture> findByUserIdAndIsCurrentTrue(Long userId);

    @Query("SELECT p FROM ProfilePicture p WHERE p.user.id = :userId AND p.isCurrent = true AND (p.isDeleted = false OR p.isDeleted IS NULL) ORDER BY p.id DESC")
    List<ProfilePicture> findCurrentPictures(@Param("userId") Long userId);

    @Modifying
    @Query("""
        UPDATE ProfilePicture p
        SET p.isCurrent = false
        WHERE p.user.id = :userId AND p.isCurrent = true
    """)
    void deactivateOldProfilePictures(@Param("userId") Long userId);

    @Query("SELECT p FROM ProfilePicture p WHERE p.user.id = :userId AND p.isCurrent = true AND (p.isDeleted = false OR p.isDeleted IS NULL) ORDER BY p.id DESC")
    List<ProfilePicture> getCurrentProfilePictureList(@Param("userId") Long userId);

    default ProfilePicture getCurrentProfilePicture(Long userId) {
        List<ProfilePicture> list = findCurrentPictures(userId);
        return (list != null && !list.isEmpty()) ? list.get(0) : null;
    }
}
