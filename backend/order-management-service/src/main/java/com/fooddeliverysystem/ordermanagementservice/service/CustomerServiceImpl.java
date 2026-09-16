package com.fooddeliverysystem.ordermanagementservice.service;

import com.fooddeliverysystem.ordermanagementservice.dto.CustomerDTO;
import com.fooddeliverysystem.ordermanagementservice.model.Customer;
import com.fooddeliverysystem.ordermanagementservice.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public CustomerDTO registerCustomer(CustomerDTO customerDTO) {
        if (!customerDTO.getPassword().equals(customerDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match");
        }

        String name = customerDTO.getFullname() != null ? customerDTO.getFullname() : "Unknown User";

        Customer customer = Customer.builder()
                .fullname(name)
                .email(customerDTO.getEmail())
                .phoneNumber(customerDTO.getPhoneNumber())
                .deliveryAddress(customerDTO.getDeliveryAddress())
                .password(customerDTO.getPassword())
                .confirmPassword(customerDTO.getConfirmPassword())
                .build();

        customer = customerRepository.save(customer);
        return convertToDTO(customer);
    }

    @Override
    public CustomerDTO loginCustomer(String email, String password) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Customer not found with email: " + email));

        if (!customer.getPassword().equals(password)) {
            throw new IllegalArgumentException("Incorrect password");
        }

        return convertToDTO(customer);
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
                .password(customer.getPassword())
                .confirmPassword(customer.getConfirmPassword())
                .build();
    }
}