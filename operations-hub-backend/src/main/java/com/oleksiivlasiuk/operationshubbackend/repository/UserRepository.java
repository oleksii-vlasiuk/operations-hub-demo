package com.oleksiivlasiuk.operationshubbackend.repository;

import com.oleksiivlasiuk.operationshubbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

