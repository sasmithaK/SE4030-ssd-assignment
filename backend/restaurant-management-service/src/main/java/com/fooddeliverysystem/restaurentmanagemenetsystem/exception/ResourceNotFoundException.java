package com.fooddeliverysystem.restaurentmanagemenetsystem.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}