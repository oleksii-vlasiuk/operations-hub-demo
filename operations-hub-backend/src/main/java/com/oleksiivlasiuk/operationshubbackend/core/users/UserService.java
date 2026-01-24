package com.oleksiivlasiuk.operationshubbackend.core.users;

import java.util.List;

import com.oleksiivlasiuk.operationshubbackend.core.audit.AuditService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuditService auditService;

    public UserService(UserRepository userRepository, AuditService auditService) {
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional
    public User create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("User with email already exists: " + request.email());
        }

        User user = new User(request.email(), request.firstName(), request.lastName());
        User saved = userRepository.save(user);

        auditService.record(
                null, // actor позже, когда будет auth
                "USER_CREATED",
                "USER",
                saved.getId(),
                "User created: " + saved.getEmail(),
                "{\"email\":\"" + saved.getEmail() + "\"}"
        );

        return saved;
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

        auditService.record(
                null,
                "USER_DISABLED",
                "USER",
                id,
                "User disabled: " + user.getEmail(),
                "{\"email\":\"" + user.getEmail() + "\"}"
        );
    }

    @Transactional
    public void enable(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: id=" + id));
        user.enable();
        userRepository.save(user);
        auditService.record(
                null,
                "USER_ENABLED",
                "USER",
                id,
                "User enabled: " + user.getEmail(),
                "{\"email\":\"" + user.getEmail() + "\"}"
        );
    }
}