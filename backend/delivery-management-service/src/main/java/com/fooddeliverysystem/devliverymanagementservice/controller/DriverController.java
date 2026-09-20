package com.fooddeliverysystem.devliverymanagementservice.controller;

import com.fooddeliverysystem.devliverymanagementservice.dto.DriverDTO;
import com.fooddeliverysystem.devliverymanagementservice.model.Driver;
import com.fooddeliverysystem.devliverymanagementservice.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
// VULN-5 FIX: CORS is no longer set per-controller with a wildcard; it's now centrally
// configured in SecurityConfig.java with a restricted allowed origin.
// @CrossOrigin(origins = "*") 
public class DriverController {

    private final DriverService driverService;

    // VULN-6 FIX: added @Valid to enforce DriverDTO's validation constraints
    @PostMapping("/register")
    public ResponseEntity<Driver> registerDriver(@Valid @RequestBody DriverDTO driverDTO) {
        Driver registeredDriver = driverService.registerDriver(driverDTO);
        return ResponseEntity.ok(registeredDriver);
    }

    // VULN-6 FIX: removed @Valid to allow partial DTOs on login
    @PostMapping("/login")
    public ResponseEntity<Driver> loginDriver(@RequestBody DriverDTO driverDTO) {
        Driver driver = driverService.loginDriver(driverDTO);
        return ResponseEntity.ok(driver);
    }

    /** View driver profile **/
    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriver(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        return ResponseEntity.ok(driver);
    }

        /** Update driver profile **/
    // VULNERABLE (VULN-5): IDOR — no check that the token belongs to the driver being updated
    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(
            @PathVariable Long id,
            @RequestBody DriverDTO driverDTO,
            Authentication authentication
    ) {
        Driver existingDriver = driverService.getDriverById(id);
        String authenticatedEmail = authentication.getName();

        if (!existingDriver.getEmail().equals(authenticatedEmail)) {
            throw new AccessDeniedException("You are not authorized to update this driver's profile");
        }

        Driver updated = driverService.updateDriver(id, driverDTO);
        return ResponseEntity.ok(updated);
    }
}

