package com.devaraj.AIClone.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.devaraj.AIClone.dto.ChatRequest;
import com.devaraj.AIClone.dto.ChatResponse;
import com.devaraj.AIClone.dto.ConversationResponse;
import com.devaraj.AIClone.entity.Message;
import com.devaraj.AIClone.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest req, Authentication auth) {
        String reply = chatService.chat(req.message(), auth.getName(), req.conversationId());
        return new ChatResponse(reply);
    }

    @GetMapping("/history")
    public java.util.List<ConversationResponse> getHistory(Authentication auth) {
        return chatService.getHistory(auth.getName());
    }

    @GetMapping("/history/{id}")
    public java.util.List<Message> getMessages(@PathVariable Long id) {
        return chatService.getConversationMessages(id);
    }

    // NEW: Delete Conversation
    @DeleteMapping("/conversation/{id}")
    public ResponseEntity<Void> deleteConversation(@PathVariable Long id, Authentication auth) {
        chatService.deleteConversation(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    // NEW: Rename Conversation
    @PutMapping("/conversation/{id}")
    public ResponseEntity<Void> updateTitle(@PathVariable Long id, @RequestBody String title, Authentication auth) {
        chatService.updateTitle(id, title, auth.getName());
        return ResponseEntity.ok().build();
    }
}