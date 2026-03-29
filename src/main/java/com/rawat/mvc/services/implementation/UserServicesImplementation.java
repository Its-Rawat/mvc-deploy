package com.rawat.mvc.services.implementation;

import com.rawat.mvc.dtos.UserDtos;
import com.rawat.mvc.entities.Users;
import com.rawat.mvc.repositories.UserRepository;
import com.rawat.mvc.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServicesImplementation implements UserService {

    @Autowired
        private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserDtos createUser(UserDtos userDto) {

        // generate user id using uuid
        userDto.setUserId(UUID.randomUUID().toString());

        Users users = dtoToEntities(userDto);
        Users savedUser = userRepository.save(users);
        return entitiesToDtos(savedUser);
    }

    @Override
    public UserDtos updateUser(UserDtos userDto, String userId) {

        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usr not found witeh id " + userId + "."));
        user.setUserName(userDto.getUserName());
        user.setUserAddress(userDto.getUserAddress());
        user.setUserEmail(userDto.getUserEmail());
        user.setUserPassword(userDto.getUserPassword());
        user.setUserGender(userDto.getUserGender());
        user.setUserWalletBalance(userDto.getUserWalletBalance());
        user.setUserPendingBills(userDto.getUserPendingBills());
        user.setUserPhoneNumber(userDto.getUserPhoneNumber());

        Users savedUser = userRepository.save(user);

        UserDtos userDtos = entitiesToDtos(savedUser);
        return userDtos;
    }

    @Override
    public void deleteUserById(String userId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usr not found witeh id " + userId + "."));
        String tempUserId = user.getUserId();
        userRepository.delete(user);
    }

    @Override
    public void deleteUserByEmail(String userEmail) {
        Users byUserEmail = userRepository.findByUserEmail(userEmail).orElseThrow(()-> new RuntimeException("Usr not found with id " + userEmail + "."));
        userRepository.delete(byUserEmail);
    }

    @Override
    public List<UserDtos> getAllUserDtos() {
        List<Users> users = userRepository.findAll();
        return users.stream().map(user -> entitiesToDtos(user)).collect(Collectors.toList());

    }

    @Override
    public UserDtos getUserById(String userId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usr not found with id " + userId + "."));
        return entitiesToDtos(user);
    }

    @Override
    public List<UserDtos> getUsersByKeyword(String keyword) {
        List<Users> userByNameContaining = userRepository.findByUserNameContaining(keyword);
        List<UserDtos> dtoUsersByNameContaining = userByNameContaining.stream().map(userWithName -> entitiesToDtos(userWithName)).collect(Collectors.toList());
        return dtoUsersByNameContaining;
    }


    // dto to user

    private Users dtoToEntities(UserDtos userDtos) {
//        Users convertedUsers = Users.builder().
//                userId(userDtos.getUserId())
//                .userEmail(userDtos.getUserEmail())
//                .userName(userDtos.getUserName())
//                .userPassword(userDtos.getUserPassword())
//                .userAge(userDtos.getUserAge())
//                .userGender(userDtos.getUserGender())
//                .userAddress(userDtos.getUserAddress())
//                .userPendingBills(userDtos.getUserPendingBills())
//                .userWalletBalance(userDtos.getUserWalletBalance())
//                .userPhoneNumber(userDtos.getUserPhoneNumber())
//                .build();
        return modelMapper.map(userDtos, Users.class);
    }

    // user to dto

    private UserDtos entitiesToDtos(Users users) {
//        UserDtos convertedDtos = UserDtos.builder()
//                .userId(users.getUserId())
//                .userName(users.getUserName())
//                .userPassword(users.getUserPassword())
//                .userAge(users.getUserAge())
//                .userGender(users.getUserGender())
//                .userAddress(users.getUserAddress())
//                .userPhoneNumber(users.getUserPhoneNumber())
//                .userWalletBalance(users.getUserWalletBalance())
//                .userPendingBills(users.getUserPendingBills())
//                .build();
        return modelMapper.map(users, UserDtos.class);
    }


}
