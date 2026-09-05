package com.auth.ums.mapper;

import com.auth.ums.models.User;
import com.auth.ums.requestmodels.Auth.UpdateUserRequest;
import com.auth.ums.requestmodels.ProfileModel.UpdateProfileRequest;
import com.auth.ums.responsemodels.user.UserDto;

public class ProfileMapper {

    // Update existing User from UpdateProfileRequest
    public static UpdateUserRequest updateProfile(UpdateUserRequest user, UpdateProfileRequest request) {

        user.setFirstName(request.getFirstName());
        user.setMiddleName(request.getMiddleName());
        user.setLastName(request.getLastName());
        user.setAge(request.getAge());
        user.setAddress(request.getAddress());
        user.setPhoneNumber(request.getPhoneNumber());
        return user;
    }

    // User → UserDto
    public static UserDto toUserDTO(User user) {
        if (user == null) {
            return null;
        }
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setMiddleName(user.getMiddleName());
        dto.setLastName(user.getLastName());
        dto.setFullName(user.getFullName());
        dto.setAge(user.getAge());
        dto.setAddress(user.getAddress());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        return dto;
    }
}

