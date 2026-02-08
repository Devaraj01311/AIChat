package com.devaraj.AIClone.dto;
import java.time.LocalDateTime;

public record ConversationResponse(Long id, String title, LocalDateTime createdAt) {}