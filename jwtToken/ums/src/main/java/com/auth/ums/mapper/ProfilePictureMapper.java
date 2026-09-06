package com.auth.ums.mapper;

import com.auth.ums.models.ProfilePicture;
import com.auth.ums.responsemodels.ProfilePicture.ProfilePictureDTO;

public class ProfilePictureMapper {

    public static ProfilePictureDTO toDto(ProfilePicture entity) {

        ProfilePictureDTO dto = new ProfilePictureDTO();
        dto.setId(entity.getId());
        dto.setFileName(entity.getFileName());
        dto.setFilePath(entity.getFilePath());
        dto.setIsCurrent(entity.getIsCurrent());

        return dto;
    }
}
