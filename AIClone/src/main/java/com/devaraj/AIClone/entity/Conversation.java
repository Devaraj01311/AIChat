package com.devaraj.AIClone.entity;

import java.time.LocalDateTime;

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
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; 

    @ManyToOne
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
}

}
