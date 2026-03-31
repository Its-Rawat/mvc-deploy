package com.rawat.mvc.controllers;

import com.rawat.mvc.dtos.ApiResponseMessage;
import com.rawat.mvc.dtos.UserDtos;
import com.rawat.mvc.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // create
    @PostMapping("/create")
    public ResponseEntity<List<UserDtos>> createUser(@RequestBody List<UserDtos> userDtos){
        List<UserDtos> user = userService.createUser(userDtos);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }
    // delete
    @DeleteMapping("/delete-by-id/{userId}")
    public ResponseEntity<ApiResponseMessage> deleteUser(@PathVariable("userId") String userId){
       userService.deleteUserById(userId);
        ApiResponseMessage build = ApiResponseMessage.builder()
                .status(HttpStatus.OK)
                .success(true)
                .message("User with ID " + userId + " is deleted from there userId")
                .build();

        return new ResponseEntity<>(build, HttpStatus.GONE);
    }

    // update
    @PutMapping("/update/{userId}")
    public ResponseEntity<UserDtos> updateUser(
            @PathVariable("userId") String userId,
            @RequestBody UserDtos userDtos
    ){
        UserDtos updatedUserDto = userService.updateUser(userDtos, userId);
        return new ResponseEntity<>(updatedUserDto, HttpStatus.OK);
    }


    // deleteByEmail
        @DeleteMapping("/delete-by-email/{userEmail}")
    public ResponseEntity<ApiResponseMessage> deleteUserByEmail(@PathVariable("userEmail") String userEmail){
        userService.deleteUserByEmail(userEmail);
        ApiResponseMessage buildMessage = ApiResponseMessage.builder()
                .message("User " + userEmail + " is deleted successfully")
                .success(true)
                .status(HttpStatus.OK)
                .build();

        return new ResponseEntity<>(buildMessage,HttpStatus.OK);
    }

    // getAll
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDtos>> getAllUsers(){
        List<UserDtos> allUserDtos = userService.getAllUserDtos();
        return new ResponseEntity<>(allUserDtos,HttpStatus.OK);
    }

    // getById
    @GetMapping("/{userId}")
    public ResponseEntity<UserDtos> getUserById(@PathVariable("userId") String userId){
        UserDtos userById = userService.getUserById(userId);
        return new ResponseEntity<>(userById,HttpStatus.OK);
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<UserDtos>> getUsersByKeyword(@PathVariable("keyword") String keyword){
        List<UserDtos> usersByKeyword = userService.getUsersByKeyword(keyword);
        return new ResponseEntity<>(usersByKeyword,HttpStatus.OK);
    }


}
