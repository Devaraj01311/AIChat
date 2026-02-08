package com.devaraj.AIClone.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.devaraj.AIClone.entity.Conversation;
import com.devaraj.AIClone.entity.User;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    // For Sidebar: Get all chats for a user
    java.util.List<Conversation> findAllByUserOrderByCreatedAtDesc(User user);
}
