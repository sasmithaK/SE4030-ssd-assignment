package com.fooddeliverysystem.common.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        // Inject properties directly as Spring would via @Value
        ReflectionTestUtils.setField(jwtUtils, "secretKey", "test_secure_key_which_must_be_256_bits_long_minimum");
        ReflectionTestUtils.setField(jwtUtils, "expiration", 3600000L); // 1 hour
        
        // Call the PostConstruct init method to generate the Key object
        jwtUtils.init();

        userDetails = new User("testuser@gourmetgo.com", "password", new ArrayList<>());
    }

    @Test
    void generateToken_ShouldGenerateValidToken() {
        String token = jwtUtils.generateToken(userDetails);
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        String username = jwtUtils.extractUsername(token);
        assertEquals("testuser@gourmetgo.com", username);
    }

    @Test
    void validateToken_ShouldReturnTrueForValidToken() {
        String token = jwtUtils.generateToken(userDetails);
        assertTrue(jwtUtils.validateToken(token, userDetails));
    }

    @Test
    void validateToken_ShouldReturnFalseForInvalidUser() {
        String token = jwtUtils.generateToken(userDetails);
        UserDetails wrongUser = new User("wrong@gourmetgo.com", "password", new ArrayList<>());
        assertFalse(jwtUtils.validateToken(token, wrongUser));
    }
}
