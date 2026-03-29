package com.rawat.mvc.dtos;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class UserDtos {

    private String userId;
    private String userPassword;
    private String userEmail;
    private String userName;
    private String userPhoneNumber;
    private String userAddress;
    private byte userAge;
    private String userGender;
    private String userWalletBalance;
    private String userPendingBills;
}
