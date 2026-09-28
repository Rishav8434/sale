package com.realnest.service;

import com.realnest.dto.response.UserResponse;
import com.realnest.security.UserPrincipal;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse getCurrentUserProfile(UserPrincipal principal);
    void deleteUser(Long id);
}
