package com.fooddeliverysystem.restaurentmanagemenetsystem.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private Role role;

    public enum Role {
        RESTAURANT_ADMIN, CUSTOMER;

        public static Role fromString(String value) {
            try {
                return Role.valueOf(value.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid role value: " + value);
            }
        }
    }
}