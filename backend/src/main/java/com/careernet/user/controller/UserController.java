package com.careernet.user.controller;

import com.careernet.common.response.ApiResponse;
import com.careernet.user.dto.UserDto;
import com.careernet.user.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ApiResponse<UserDto.UserResponse> getUser(@PathVariable Long userId) {
        return ApiResponse.ok(userService.getUser(userId));
    }
}
