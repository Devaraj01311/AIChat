package com.devaraj.AIClone.service;

import com.devaraj.AIClone.dto.*;
import com.devaraj.AIClone.entity.User;
import com.devaraj.AIClone.repository.UserRepository;
import com.devaraj.AIClone.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder;

    // 1. REGISTER
    public AuthResponse register(AuthRequest req) {
        if (repo.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User u = new User();
        u.setUsername(req.username());
        u.setEmail(req.email());
        u.setPassword(encoder.encode(req.password()));
        repo.save(u);

        return new AuthResponse(u.getUsername(), u.getEmail(), u.getPassword());
    }

    // 2. LOGIN
    public LoginResponse login(AuthRequest req) {
        User u = repo.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(req.password(), u.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(u.getEmail());
        return new LoginResponse(token);
    }

  // 3. NEW: GUEST LOGIN (FIXED)
    public LoginResponse guestLogin() {
        // 1. Check if the "Guest User" already exists in the DB
        var existingGuest = repo.findByUsername("Guest User");
        
        if (existingGuest.isPresent()) {
            // 2. If exists, just log them in!
            User u = existingGuest.get();
            String token = jwtService.generateToken(u.getEmail());
            return new LoginResponse(token);
        }

        // 3. If NOT exists, create it (This only happens once)
        String uniqueId = UUID.randomUUID().toString();
        String guestEmail = "guest_" + uniqueId.substring(0, 8) + "@temp.com";
        
        User u = new User();
        u.setUsername("Guest User"); // This name is fixed
        u.setEmail(guestEmail);
        u.setPassword(encoder.encode(uniqueId)); 
        repo.save(u);

        String token = jwtService.generateToken(u.getEmail());
        return new LoginResponse(token);
    }
    // 4. GET PROFILE
    public UserProfileResponse getUserProfile(String email) {
        User u = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(
                u.getId(),
                u.getUsername(),
                u.getEmail()
        );
    }
}