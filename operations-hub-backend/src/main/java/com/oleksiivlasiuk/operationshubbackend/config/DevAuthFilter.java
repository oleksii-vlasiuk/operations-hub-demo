package com.oleksiivlasiuk.operationshubbackend.config;

import com.oleksiivlasiuk.operationshubbackend.core.users.User;
import com.oleksiivlasiuk.operationshubbackend.core.users.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class DevAuthFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    public DevAuthFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("X-User-Id");
        if (header != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                Long userId = Long.parseLong(header);

                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    // ВАЖНО: роли Spring Security ожидают префикс ROLE_
                    String role = "ROLE_" + user.getRole().name(); // ADMIN/MANAGER/USER

                    var auth = new UsernamePasswordAuthenticationToken(
                            user, // principal = сам user (удобно)
                            null,
                            List.of(new SimpleGrantedAuthority(role))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (NumberFormatException ignored) {
                // если X-User-Id кривой — просто не аутентифицируем
            }
        }

        filterChain.doFilter(request, response);
    }
}
