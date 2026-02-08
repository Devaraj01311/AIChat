package com.devaraj.AIClone.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;

    @Column(length = 5000)
    private String content;

    @ManyToOne
    private Conversation conversation;

    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
}

}
