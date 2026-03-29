package com.rawat.mvc.repositories;

import com.rawat.mvc.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<Users, String> {
    // custom finder methods
    Optional<Users> findByUserEmail(String userEmail);

    List<Users> findByUserNameContaining(String userName);
}
