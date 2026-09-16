package com.fooddeliverysystem.devliverymanagementservice.service;

import com.fooddeliverysystem.devliverymanagementservice.dto.DriverDTO;
import com.fooddeliverysystem.devliverymanagementservice.model.Driver;

public interface DriverService {
    Driver registerDriver(DriverDTO driverDTO);
    Driver loginDriver(DriverDTO driverDTO);

    Driver getDriverById(Long id);
    Driver updateDriver(Long id, DriverDTO driverDTO);
}
