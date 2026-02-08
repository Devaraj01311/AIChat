package com.devaraj.AIClone.service;

import com.devaraj.AIClone.dto.ConversationResponse;
import com.devaraj.AIClone.entity.Conversation;
import com.devaraj.AIClone.entity.Message;
import com.devaraj.AIClone.entity.User;
import com.devaraj.AIClone.repository.ConversationRepository;
import com.devaraj.AIClone.repository.MessageRepository;
import com.devaraj.AIClone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final GeminiService geminiService;
    private final UserRepository userRepo;
    private final ConversationRepository convoRepo;
    private final MessageRepository msgRepo;

    // 1. Get List of all chats for sidebar
    public List<ConversationResponse> getHistory(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return convoRepo.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(c -> new ConversationResponse(c.getId(), c.getTitle(), c.getCreatedAt()))
                .collect(java.util.stream.Collectors.toList());
    }

    // 2. Get all messages for a specific chat
    public List<Message> getConversationMessages(Long convoId) {
        return msgRepo.findByConversationIdOrderByCreatedAtAsc(convoId);
    }

    // 3. Chat Logic
    public String chat(String message, String email, Long conversationId) {
        User user = userRepo.findByEmail(email).orElseThrow();
        
        Conversation convo;
        if (conversationId != null) {
            convo = convoRepo.findById(conversationId).orElseThrow();
        } else {
            convo = new Conversation();
            convo.setUser(user);
            convo.setTitle(message.length() > 30 ? message.substring(0, 30) + "..." : message);
            convo = convoRepo.save(convo);
        }

        msgRepo.save(createMsg("user", message, convo));
        String reply = geminiService.generateText(message);
        msgRepo.save(createMsg("assistant", reply, convo));

        return reply;
    }

    // 4. NEW: Delete Conversation
    @Transactional
    public void deleteConversation(Long id, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Conversation convo = convoRepo.findById(id).orElseThrow();

        // Security Check: Only allow if user owns the conversation
        if (!convo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You do not own this conversation");
        }

        // Delete all messages first
        List<Message> messages = msgRepo.findByConversationIdOrderByCreatedAtAsc(id);
        msgRepo.deleteAll(messages);
        
        // Delete conversation
        convoRepo.delete(convo);
    }

    // 5. NEW: Update Title
    public void updateTitle(Long id, String newTitle, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Conversation convo = convoRepo.findById(id).orElseThrow();

        if (!convo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        convo.setTitle(newTitle);
        convoRepo.save(convo);
    }

    private Message createMsg(String role, String text, Conversation c) {
        Message m = new Message();
        m.setRole(role);
        m.setContent(text);
        m.setConversation(c);
        return m;
    }
}