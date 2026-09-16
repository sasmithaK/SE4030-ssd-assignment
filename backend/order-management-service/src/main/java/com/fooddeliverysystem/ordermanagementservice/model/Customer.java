package com.fooddeliverysystem.ordermanagementservice.model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullname;
    private String email;
    private String phoneNumber;
    private String deliveryAddress;
    private String password;
    private String confirmPassword;
}