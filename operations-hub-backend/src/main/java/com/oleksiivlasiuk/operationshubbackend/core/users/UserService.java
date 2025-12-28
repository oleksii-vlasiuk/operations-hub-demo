package com.oleksiivlasiuk.operationshubbackend.core.users;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public User create(CreateUserRequest request) {
        if (repository.existsByEmail(request.email())) {
            throw new IllegalStateException("User already exists");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        return repository.save(user);
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public void disable(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setStatus(UserStatus.DISABLED);
        repository.save(user);
    }
}

