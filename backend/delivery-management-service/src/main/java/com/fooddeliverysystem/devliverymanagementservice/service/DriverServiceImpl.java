package com.fooddeliverysystem.devliverymanagementservice.service;

import com.fooddeliverysystem.devliverymanagementservice.dto.DriverDTO;
import com.fooddeliverysystem.devliverymanagementservice.model.Driver;
import com.fooddeliverysystem.devliverymanagementservice.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Driver registerDriver(DriverDTO driverDTO) {
        if (driverRepository.findByEmail(driverDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Driver driver = Driver.builder()
                .fullName(driverDTO.getFullName())
                .email(driverDTO.getEmail())
                .phone(driverDTO.getPhone())
                .vehicle(driverDTO.getVehicle())
                .password(passwordEncoder.encode(driverDTO.getPassword()))
                .build();

        return driverRepository.save(driver);
    }

    @Override
    public Driver loginDriver(DriverDTO driverDTO) {
        Driver driver = driverRepository.findByEmail(driverDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(driverDTO.getPassword(), driver.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

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
        // update only mutable fields (email stays the same)
        existing.setFullName(dto.getFullName());
        existing.setPhone(dto.getPhone());
        existing.setVehicle(dto.getVehicle());
        // if password provided, re-encode
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return driverRepository.save(existing);
    }
}
