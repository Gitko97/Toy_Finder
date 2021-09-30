package com.test.toy_springboot.user.service;

import com.test.toy_springboot.user.domain.User;
import com.test.toy_springboot.user.dto.SignUpDto;
import com.test.toy_springboot.user.dto.UserInfoDto;
import com.test.toy_springboot.user.repository.UserRepository;
import com.test.toy_springboot.user.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public User signup(SignUpDto signUpDto) {
        if (userRepository.findOneByUserId(signUpDto.getUserId()).orElse(null) != null) {
            throw new RuntimeException("이미 가입되어 있는 유저입니다.");
        }

        //빌더 패턴의 장점
//        Authority authority = Authority.builder()
//                .authorityName("ROLE_USER")
//                .build();

        User user = User.builder()
                .userId(signUpDto.getUserId())
                .password(passwordEncoder.encode(signUpDto.getPassword()))
                .name(signUpDto.getName())
                .phoneNumber(signUpDto.getPhoneNumber())
                .authority("ROLE_USER")
                .activated(true)
                .build();

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities(String username) {
        return userRepository.findOneByUserId(username);
    }

    @Transactional(readOnly = true)
    public Optional<User> getMyUserWithAuthorities() {
        return SecurityUtil.getCurrentUsername().flatMap(userRepository::findOneByUserId);
    }

    @Transactional(readOnly = true)
    public UserInfoDto getUserInfoById(String userId) {
        User user = userRepository.findOneByUserId(userId).orElseThrow(NoSuchElementException::new);

        return UserInfoDto.from(user);
    }
}