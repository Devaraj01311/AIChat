package com.devaraj.AIClone.dto;

public record AuthRequest(
        String username,
        String email,
        String password
) {}
