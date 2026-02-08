package com.devaraj.AIClone.repository;
import com.devaraj.AIClone.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // For loading chat history: Get all messages for one conversation
    java.util.List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
}