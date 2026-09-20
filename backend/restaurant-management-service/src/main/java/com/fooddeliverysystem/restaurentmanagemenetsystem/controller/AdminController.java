package com.fooddeliverysystem.restaurentmanagemenetsystem.controller;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.RestaurantDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.UserDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

// [VULN-4] SECURITY ISSUE - No role check on admin endpoints, any CUSTOMER JWT can access
// Missing @PreAuthorize("hasRole('ADMIN')") - must add role-based access control
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    // [VULN-4] FIXED - Added @PreAuthorize role checks on all admin endpoints

    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO registerAdmin(@RequestBody UserDTO userDTO) {
        userDTO.setRole("ADMIN");
        return adminService.registerAdmin(userDTO);
    }

    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    @GetMapping("/restaurants")
    public List<RestaurantDTO> getAllRestaurants() {
        return adminService.getAllRestaurants();
    }

    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    @PutMapping("/restaurants/{restaurantId}/verify")
    public RestaurantDTO verifyRestaurant(@PathVariable String restaurantId,
            @RequestParam boolean verified) {
        return adminService.verifyRestaurant(restaurantId, verified);
    }

    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    @PostMapping("/financial-transactions")
    @ResponseStatus(HttpStatus.OK)
    public void processFinancialTransaction(@RequestParam String restaurantId,
            @RequestParam double amount) {
        adminService.processFinancialTransaction(restaurantId, amount);
    }
}