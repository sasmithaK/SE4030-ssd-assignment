package com.fooddeliverysystem.restaurentmanagemenetsystem.service;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.LoginDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.UserDTO;

import java.util.List;

public interface AuthService {
    UserDTO register(UserDTO userDTO);
    UserDTO login(LoginDTO loginDTO);
    List<UserDTO> getAllUsers();
    UserDTO getUserById(String id);
}