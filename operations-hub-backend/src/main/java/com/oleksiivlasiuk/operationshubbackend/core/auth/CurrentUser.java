package com.oleksiivlasiuk.operationshubbackend.core.auth;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    public Long id() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) return null;
        // principal "1"
        return Long.valueOf(auth.getPrincipal().toString());
    }
}
