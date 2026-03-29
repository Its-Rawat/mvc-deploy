package com.rawat.mvc.services;

import com.rawat.mvc.dtos.UserDtos;
import org.springframework.stereotype.Service;

import java.util.List;

public interface UserService {
    // create
    UserDtos createUser(UserDtos userDto);

    // update
    UserDtos updateUser(UserDtos userDto, String userId);

    // delete
    void deleteUserById(String userId);

    // deleteByEmail
    void deleteUserByEmail(String userEmail);

    // getAll
    List<UserDtos> getAllUserDtos();

    // getUserById
    UserDtos getUserById(String userId);

    // search user
    List<UserDtos> getUsersByKeyword(String keyword);


}
