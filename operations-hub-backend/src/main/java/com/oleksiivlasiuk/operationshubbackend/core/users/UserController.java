package com.oleksiivlasiuk.operationshubbackend.core.users;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping("/me")
    public UserResponse me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof User)) {
            throw new IllegalStateException("Not authenticated");
        }
        return userMapper.toResponse((User) auth.getPrincipal());
    }

    @GetMapping
    public List<UserResponse> getUsers(@RequestParam(required = false) UserStatus status) {
        List<User> users = status == null ? userService.getAll() : userService.getByStatus(status);
        return users.stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @PostMapping
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        User user = userService.create(request);
        return userMapper.toResponse(user);
    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<Void> disableUser(@PathVariable Long id) {
        userService.disable(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/enable")
    public void enableUser(@PathVariable Long id) {
        userService.enable(id);
    }

}