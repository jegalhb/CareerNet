package com.careernet.user.service;

import com.careernet.common.exception.BusinessException;
import com.careernet.common.exception.ResourceNotFoundException;
import com.careernet.user.domain.AppUser;
import com.careernet.user.dto.UserDto;
import com.careernet.user.repository.AppUserRepository;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDto.UserResponse signup(UserDto.SignupRequest request) {
        String email = normalizeEmail(request.getEmail());
        appUserRepository.findByEmail(email)
                .ifPresent(user -> {
                    throw new BusinessException("Already registered email.");
                });

        AppUser user = new AppUser(
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getUserNm().trim(),
                trimToNull(request.getEducation()),
                trimToNull(request.getInterest())
        );
        return UserDto.UserResponse.from(appUserRepository.save(user));
    }

    public UserDto.UserResponse login(UserDto.LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Invalid email or password."));

        if (user.getDeletedAt() != null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Invalid email or password.");
        }
        return UserDto.UserResponse.from(user);
    }

    public UserDto.UserResponse getUser(Long userId) {
        AppUser user = appUserRepository.findById(userId)
                .filter(found -> found.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        return UserDto.UserResponse.from(user);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
