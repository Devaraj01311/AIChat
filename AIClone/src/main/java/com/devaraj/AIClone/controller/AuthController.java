package com.devaraj.AIClone.controller;

import com.devaraj.AIClone.dto.*;
import com.devaraj.AIClone.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(service.register(req));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(service.login(req));
    }

    // NEW: GUEST LOGIN
    @PostMapping("/guest")
    public ResponseEntity<LoginResponse> guestLogin() {
        return ResponseEntity.ok(service.guestLogin());
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }
  
    // GET USER PROFILE 
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return ResponseEntity.ok(service.getUserProfile(email));
    }
}