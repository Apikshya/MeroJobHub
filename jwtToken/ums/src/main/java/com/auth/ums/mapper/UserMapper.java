package com.auth.ums.mapper;

import com.auth.ums.models.User;
import com.auth.ums.requestmodels.Auth.AddUserRequest;
import com.auth.ums.requestmodels.Auth.DeleteUserRequest;
import com.auth.ums.requestmodels.Auth.UpdateUserRequest;
import com.auth.ums.responsemodels.user.UserDto;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {
    // Add User (Request → Entity)
    public static User addUser(AddUserRequest request) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setMiddleName(request.getMiddleName());
        user.setLastName(request.getLastName());
        user.setAge(request.getAge());
        user.setAddress(request.getAddress());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(request.getPassword());

        return user;
    }

    public static User updateUser( User user ,UpdateUserRequest request) {
        if (request == null) {
            return null;
        }
        user.setFirstName(request.getFirstName());
        user.setMiddleName(request.getMiddleName());
        user.setLastName(request.getLastName());
        user.setAge(request.getAge());
        user.setAddress(request.getAddress());
        user.setPhoneNumber(request.getPhoneNumber());
        return user;
    }

    public static User deleteUser(User user , DeleteUserRequest request) {
        if (request == null) {
            return null;
        }
        user.setRemarks(request.getRemarks());
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
        dto.setUserType(user.getUserType());
        dto.setSystemCode(user.getSystemCode());
        return dto;
    }

    // ✅ List<User> → List<UserDto>
    public static List<UserDto> toUserDTOList(List<User> users) {
        if (users == null) {
            return List.of(); // safer than null
        }

        return users.stream()
                .map(UserMapper::toUserDTO) // ✅ correct static reference
                .collect(Collectors.toList());
    }


}


