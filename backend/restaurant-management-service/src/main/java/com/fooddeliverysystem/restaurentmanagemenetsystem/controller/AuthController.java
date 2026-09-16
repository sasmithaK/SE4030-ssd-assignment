package com.fooddeliverysystem.restaurentmanagemenetsystem.controller;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.LoginDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.UserDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.exception.InvalidCredentialsException;
import com.fooddeliverysystem.restaurentmanagemenetsystem.exception.ResourceNotFoundException;
import com.fooddeliverysystem.restaurentmanagemenetsystem.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            // Validate role
            if (userDTO.getRole() == null || userDTO.getRole().isEmpty()) {
                return ResponseEntity.badRequest().body("Role is required");
            }

            // Convert role to uppercase for case-insensitive matching
            String roleUpper = userDTO.getRole().toUpperCase();
            if (!roleUpper.equals("RESTAURANT_ADMIN") && !roleUpper.equals("CUSTOMER")) {
                return ResponseEntity.badRequest()
                        .body("Invalid role. Allowed values: RESTAURANT_ADMIN, CUSTOMER");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(userDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            UserDTO user = authService.login(loginDTO);
            return ResponseEntity.ok()
                    .header("Login-Success", "true")
                    .body(user);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Account not found",
                            "message", "No user exists with this email address"));
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", "Authentication failed",
                            "message", "Incorrect password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Login error",
                            "message", "An unexpected error occurred"));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(authService.getUserById(id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "User not found",
                            "message", "No user exists with this ID"));
        }
    }
}