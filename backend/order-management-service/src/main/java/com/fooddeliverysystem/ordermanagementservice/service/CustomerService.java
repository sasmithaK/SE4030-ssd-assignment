package com.fooddeliverysystem.ordermanagementservice.service;

import com.fooddeliverysystem.ordermanagementservice.dto.CustomerDTO;
import java.util.List;

public interface CustomerService {
    CustomerDTO registerCustomer(CustomerDTO customerDTO);
    CustomerDTO loginCustomer(String email, String password);
    CustomerDTO getCustomerById(Long customerId);
    List<CustomerDTO> getAllCustomers();
}