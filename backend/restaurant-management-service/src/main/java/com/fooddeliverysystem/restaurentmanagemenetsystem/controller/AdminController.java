package com.fooddeliverysystem.restaurentmanagemenetsystem.controller;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.RestaurantDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.UserDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO registerAdmin(@RequestBody UserDTO userDTO) {
        userDTO.setRole("ADMIN");
        return adminService.registerAdmin(userDTO);
    }

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/restaurants")
    public List<RestaurantDTO> getAllRestaurants() {
        return adminService.getAllRestaurants();
    }

    @PutMapping("/restaurants/{restaurantId}/verify")
    public RestaurantDTO verifyRestaurant(@PathVariable String restaurantId,
                                        @RequestParam boolean verified) {
        return adminService.verifyRestaurant(restaurantId, verified);
    }

    @PostMapping("/financial-transactions")
    @ResponseStatus(HttpStatus.OK)
    public void processFinancialTransaction(@RequestParam String restaurantId,
                                         @RequestParam double amount) {
        adminService.processFinancialTransaction(restaurantId, amount);
    }
}