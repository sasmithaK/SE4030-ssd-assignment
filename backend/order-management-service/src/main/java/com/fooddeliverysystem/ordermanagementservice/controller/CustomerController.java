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
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
    public CustomerDTO login(@RequestBody CustomerDTO customerDTO, jakarta.servlet.http.HttpServletResponse response) {
        CustomerDTO result = customerService.loginCustomer(customerDTO.getEmail(), customerDTO.getPassword());
        
        // [FIX VULN-7] Move JWT to HttpOnly cookie
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", result.getToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        
        result.setToken(null); // Don't expose token in JSON response
        return result;
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