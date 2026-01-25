package com.oleksiivlasiuk.operationshubbackend.core.auth;

import com.oleksiivlasiuk.operationshubbackend.core.users.User;
import com.oleksiivlasiuk.operationshubbackend.core.users.Role;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    public User requireUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User u)) {
            throw new IllegalStateException("Not authenticated");
        }
        return u;
    }

    public Long id() {
        return requireUser().getId();
    }

    public Role role() {
        return requireUser().getRole();
    }

    public boolean isAdminOrManager() {
        var r = role();
        return r == Role.ADMIN || r == Role.MANAGER;
    }
}
