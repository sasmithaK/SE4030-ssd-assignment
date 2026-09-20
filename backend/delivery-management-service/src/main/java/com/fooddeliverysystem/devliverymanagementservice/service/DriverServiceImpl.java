package com.fooddeliverysystem.devliverymanagementservice.service;

import com.fooddeliverysystem.devliverymanagementservice.dto.DriverDTO;
import com.fooddeliverysystem.devliverymanagementservice.model.Driver;
import com.fooddeliverysystem.devliverymanagementservice.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// VULN-9 FIX: added @Slf4j and security-relevant logging (registration, login
// success/failure, profile updates) so these events are auditable
@Slf4j
@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Driver registerDriver(DriverDTO driverDTO) {
        if (driverRepository.findByEmail(driverDTO.getEmail()).isPresent()) {
            log.warn("Registration failed: email already registered - {}", driverDTO.getEmail());
            throw new RuntimeException("Email already registered");
        }

        Driver driver = Driver.builder()
                .fullName(driverDTO.getFullName())
                .email(driverDTO.getEmail())
                .phone(driverDTO.getPhone())
                .vehicle(driverDTO.getVehicle())
                .password(passwordEncoder.encode(driverDTO.getPassword()))
                .build();

        Driver saved = driverRepository.save(driver);
        log.info("New driver registered: id={}, email={}", saved.getId(), saved.getEmail());
        return saved;
    }

    @Override
    public Driver loginDriver(DriverDTO driverDTO) {
        Driver driver = driverRepository.findByEmail(driverDTO.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: no account found for email={}", driverDTO.getEmail());
                    return new RuntimeException("Invalid email or password");
                });

        if (!passwordEncoder.matches(driverDTO.getPassword(), driver.getPassword())) {
            log.warn("Login failed: incorrect password for email={}", driverDTO.getEmail());
            throw new RuntimeException("Invalid email or password");
        }

        log.info("Driver logged in successfully: id={}, email={}", driver.getId(), driver.getEmail());
        return driver;
    }

    @Override
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id " + id));
    }

    @Override
    public Driver updateDriver(Long id, DriverDTO dto) {
        Driver existing = getDriverById(id);
        existing.setFullName(dto.getFullName());
        existing.setPhone(dto.getPhone());
        existing.setVehicle(dto.getVehicle());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(dto.getPassword()));
            log.info("Password changed for driver id={}, email={}", existing.getId(), existing.getEmail());
        }
        Driver saved = driverRepository.save(existing);
        log.info("Driver profile updated: id={}, email={}", saved.getId(), saved.getEmail());
        return saved;
    }
}