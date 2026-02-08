package com.devaraj.AIClone.dto;

public record AuthResponse(
    String username,
    String email,
    String password 
) {}