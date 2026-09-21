package com.fooddeliverysystem.devliverymanagementservice.controller;

import com.fooddeliverysystem.devliverymanagementservice.dto.DriverDTO;
import com.fooddeliverysystem.devliverymanagementservice.dto.DriverResponseDTO;
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

    /* VULNERABLE (Hash Vul - same pattern as V7): returns the raw Driver entity,
      including the bcrypt password hash, in the response body*/
    // VULN-6 FIX: added @Valid to enforce DriverDTO's validation constraints
    // HASH FIX: returns DriverResponseDTO instead of the raw entity to exclude the password hash
    @PostMapping("/register")
    public ResponseEntity<DriverResponseDTO> registerDriver(@Valid @RequestBody DriverDTO driverDTO) {
        Driver registeredDriver = driverService.registerDriver(driverDTO);
        return ResponseEntity.ok(DriverResponseDTO.fromEntity(registeredDriver));
    }

    /* VULNERABLE (Hash Vul - same pattern as V7): returns the raw Driver entity,
      including the bcrypt password hash, in the response body*/
    // VULN-6 FIX: removed @Valid to allow partial DTOs on login
    // HASH FIX: returns DriverResponseDTO instead of the raw entity to exclude the password hash
    @PostMapping("/login")
    public ResponseEntity<DriverResponseDTO> loginDriver(@RequestBody DriverDTO driverDTO) {
        Driver driver = driverService.loginDriver(driverDTO);
        return ResponseEntity.ok(DriverResponseDTO.fromEntity(driver));
    }

    /** View driver profile **/
    // HASH FIX: returns DriverResponseDTO instead of the raw entity to exclude the password hash
    @GetMapping("/{id}")
    public ResponseEntity<DriverResponseDTO> getDriver(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        return ResponseEntity.ok(DriverResponseDTO.fromEntity(driver));
    }

    /** Update driver profile **/
    // VULNERABLE (VULN-5): IDOR — no check that the token belongs to the driver being updated
    // HASH FIX: returns DriverResponseDTO instead of the raw entity to exclude the password hash
    @PutMapping("/{id}")
    public ResponseEntity<DriverResponseDTO> updateDriver(
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
        return ResponseEntity.ok(DriverResponseDTO.fromEntity(updated));
    }
}