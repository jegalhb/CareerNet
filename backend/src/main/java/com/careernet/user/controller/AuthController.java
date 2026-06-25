package com.careernet.user.controller;

import com.careernet.common.response.ApiResponse;
import com.careernet.user.dto.UserDto;
import com.careernet.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ApiResponse<UserDto.UserResponse> signup(@Valid @RequestBody UserDto.SignupRequest request) {
        return ApiResponse.ok("Signup completed.", userService.signup(request));
    }

    @PostMapping("/login")
    public ApiResponse<UserDto.UserResponse> login(@Valid @RequestBody UserDto.LoginRequest request) {
        return ApiResponse.ok("Login completed.", userService.login(request));
    }
}
