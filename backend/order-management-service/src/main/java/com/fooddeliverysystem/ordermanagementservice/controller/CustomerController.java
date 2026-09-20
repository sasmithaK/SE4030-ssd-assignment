package com.fooddeliverysystem.ordermanagementservice.controller;

import com.fooddeliverysystem.ordermanagementservice.dto.CustomerDTO;
import com.fooddeliverysystem.ordermanagementservice.service.CustomerService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    // [FIX VULN-6] Added @Valid to enforce bean validation for incoming request
    public CustomerDTO registerCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        return customerService.registerCustomer(customerDTO);
    }

    @PostMapping("/login")
    // [FIX VULN-6] Removed @Valid from login as it causes 500 errors when only email/password are provided
    public CustomerDTO login(@RequestBody CustomerDTO customerDTO) {
        return customerService.loginCustomer(customerDTO.getEmail(), customerDTO.getPassword());
    }

    @GetMapping("/{customerId}")
    public CustomerDTO getCustomerById(@PathVariable Long customerId) {
        return customerService.getCustomerById(customerId);
    }

    @GetMapping
    public List<CustomerDTO> getAllCustomers() {
        return customerService.getAllCustomers();
    }
}