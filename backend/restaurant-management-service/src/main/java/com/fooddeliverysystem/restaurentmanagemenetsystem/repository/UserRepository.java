// UserRepository.java
package com.fooddeliverysystem.restaurentmanagemenetsystem.repository;

import com.fooddeliverysystem.restaurentmanagemenetsystem.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}