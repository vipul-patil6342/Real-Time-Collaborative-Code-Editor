package com.vipulpatil.code_editor.security.service;

import com.vipulpatil.code_editor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identity) throws UsernameNotFoundException {
        return userRepository.findByUsernameOrEmail(identity)
                .orElseThrow(() -> new UsernameNotFoundException("User not found : " + identity));
    }
}
