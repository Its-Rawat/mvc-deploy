package com.rawat.mvc.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "user_table")
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Builder
public class Users {
    @Id
    private String userId;
    @Column(unique = false, nullable = false, length = 50)
    private String userName;
    @Column(unique = false, nullable = false, length = 50)
    private String userPassword;
    @Column(unique = true, nullable = false, length = 50)
    private String userEmail;
    @Column(unique = true, nullable = true, length = 10)
    private String userPhoneNumber;
    @Column(unique = false, nullable = false, length = 100)
    private String userAddress;
    @Column(unique = false, nullable = false, length = 120)
    private byte userAge;
    @Column(unique = false, nullable = true, length = 10)
    private String userGender;
    @Column(unique = false, nullable = true)
    private String userWalletBalance;
    @Column(unique = false, nullable = true)
    private String userPendingBills;

}
