package com.oleksiivlasiuk.operationshubbackend.core.users;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get all users")
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public UserResponse createUser(@RequestBody CreateUserRequest request) {
        User user = userService.create(request);
        return toResponse(user);
    }

    @DeleteMapping("/{id}")
    public void disableUser(@PathVariable Long id) {
        userService.disable(id);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getStatus()
        );
    }
}