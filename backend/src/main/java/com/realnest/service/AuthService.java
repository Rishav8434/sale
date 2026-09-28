package com.realnest.service;

import com.realnest.dto.request.LoginRequest;
import com.realnest.dto.request.RegisterRequest;
import com.realnest.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
