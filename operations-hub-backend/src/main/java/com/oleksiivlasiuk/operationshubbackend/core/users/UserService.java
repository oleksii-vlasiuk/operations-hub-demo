package com.oleksiivlasiuk.operationshubbackend.core.users;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("User with email already exists: " + request.email());
        }

        User user = new User(request.email(), request.firstName(), request.lastName());
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<User> getByStatus(UserStatus status) {
        return userRepository.findByStatus(status);
    }

    @Transactional
    public void disable(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: id=" + id));
        user.disable();
        userRepository.save(user);
    }

    @Transactional
    public void enable(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: id=" + id));
        user.enable();
        userRepository.save(user);
    }

}