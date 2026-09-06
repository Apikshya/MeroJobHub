package com.auth.ums.mapper;
import com.auth.ums.models.RefreshToken;
import com.auth.ums.requestmodels.RefreshTokenRequestModel.AddRefreshTokenRequest;
import com.auth.ums.responsemodels.RefreshToken.RefreshTokenDTO;
import java.util.List;
import java.util.stream.Collectors;
public class RefreshTokenMapper {
    public static RefreshToken addRefreshToken(AddRefreshTokenRequest request) {
        if (request == null) {
            return null;
        }
        RefreshToken entity = new RefreshToken();
        entity.setUserId(request.getUserId()); // ✅ entity reference
        entity.setTokenHash(request.getTokenHash());
        entity.setExpiresAt(request.getExpiresAt());
        entity.setRevoked(request.isRevoked());
        return entity;
    }
    // Entity → DTO
    public static RefreshTokenDTO toDTO(RefreshToken token) {
        if (token == null) {
            return null;
        }

        RefreshTokenDTO dto = new RefreshTokenDTO();
        dto.setId(token.getId());
        dto.setUserId(token.getUserId());
        dto.setTokenHash(token.getTokenHash());
        dto.setExpiresAt(token.getExpiresAt());
        dto.setRevoked(token.isRevoked());
        dto.setIsActive(token.getIsActive());
        return dto;
    }

    // List<Entity> → List<DTO>
    public static List<RefreshTokenDTO> toDTOList(List<RefreshToken> tokens) {
        if (tokens == null) {
            return List.of();
        }
        return tokens.stream()
                .map(RefreshTokenMapper::toDTO)
                .collect(Collectors.toList());
    }
}

