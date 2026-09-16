package com.fooddeliverysystem.devliverymanagementservice.controller;

import com.fooddeliverysystem.devliverymanagementservice.dto.DriverDTO;
import com.fooddeliverysystem.devliverymanagementservice.model.Driver;
import com.fooddeliverysystem.devliverymanagementservice.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
// VULNERABLE (VULN-5): wildcard CORS allows requests from any origin, not just the trusted frontend
@CrossOrigin(origins = "*") // Allow React frontend to hit the backend
public class DriverController {

    private final DriverService driverService;

    @PostMapping("/register")
    public ResponseEntity<Driver> registerDriver(@RequestBody DriverDTO driverDTO) {
        Driver registeredDriver = driverService.registerDriver(driverDTO);
        return ResponseEntity.ok(registeredDriver);
    }

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
    // VULNERABLE (VULN-5): IDOR — no check that the authenticated user owns this driver id, so any logged-in driver can update anyone else's profile
    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(
            @PathVariable Long id,
            @RequestBody DriverDTO driverDTO
    ) {
        Driver updated = driverService.updateDriver(id, driverDTO);
        return ResponseEntity.ok(updated);
    }
}

