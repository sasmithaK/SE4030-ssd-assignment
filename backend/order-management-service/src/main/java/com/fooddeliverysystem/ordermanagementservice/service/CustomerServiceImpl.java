package com.fooddeliverysystem.ordermanagementservice.service;

import com.fooddeliverysystem.ordermanagementservice.dto.CustomerDTO;
import com.fooddeliverysystem.ordermanagementservice.model.Customer;
import com.fooddeliverysystem.ordermanagementservice.repository.CustomerRepository;
import com.fooddeliverysystem.common.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public CustomerDTO registerCustomer(CustomerDTO customerDTO) {
        if (!customerDTO.getPassword().equals(customerDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match");
        }

        String name = customerDTO.getFullname() != null ? customerDTO.getFullname() : "Unknown User";

        // [FIX VULN-3] Hashed the password before saving using BCrypt
        Customer customer = Customer.builder()
                .fullname(name)
                .email(customerDTO.getEmail())
                .phoneNumber(customerDTO.getPhoneNumber())
                .deliveryAddress(customerDTO.getDeliveryAddress())
                .password(passwordEncoder.encode(customerDTO.getPassword()))
                .confirmPassword(passwordEncoder.encode(customerDTO.getConfirmPassword()))
                .build();

        customer = customerRepository.save(customer);
        log.info("Customer registered successfully with email: {}", customer.getEmail());
        return convertToDTO(customer);
    }

    @Override
    public CustomerDTO loginCustomer(String email, String password) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Login attempt failed: customer not found for email {}", email);
                    return new IllegalArgumentException("Customer not found with email: " + email);
                });

        // [FIX VULN-3] Use passwordEncoder.matches() instead of plaintext comparison
        if (!passwordEncoder.matches(password, customer.getPassword())) {
            // [FIX VULN-9] Added logging for failed authentication attempts
            log.warn("Login attempt failed: incorrect password for email {}", email);
            throw new IllegalArgumentException("Incorrect password");
        }

        log.info("Customer logged in successfully: {}", email);
        
        // Generate JWT Token and set to DTO
        String token = jwtUtils.generateTokenFromOAuth(customer.getEmail());
        CustomerDTO customerDTO = convertToDTO(customer);
        customerDTO.setToken(token);
        
        return customerDTO;
    }

    @Override
    public CustomerDTO getCustomerById(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Customer not found with id: " + customerId));
        return convertToDTO(customer);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CustomerDTO convertToDTO(Customer customer) {
        return CustomerDTO.builder()
                .id(customer.getId())
                .fullname(customer.getFullname())
                .email(customer.getEmail())
                .phoneNumber(customer.getPhoneNumber())
                .deliveryAddress(customer.getDeliveryAddress())
                // [FIX VULN-7] Removed password and confirmPassword from response to prevent leak
                .password(null)
                .confirmPassword(null)
                .build();
    }
}