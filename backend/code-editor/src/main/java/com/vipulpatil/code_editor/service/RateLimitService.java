package com.vipulpatil.code_editor.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final StringRedisTemplate stringRedisTemplate;

    public boolean isAllowed(String clientId, int limit, int windowSeconds){
        String key = "rate:limit:" + clientId;

        //Increment the counter
        Long currentCount = stringRedisTemplate.opsForValue().increment(key);

        //If it's the first request in the window, set the expiration
        if(currentCount != null && currentCount == 1){
            stringRedisTemplate.expire(key, Duration.ofSeconds(windowSeconds));
        }

        //Deny if the limit is exceeded
        return currentCount != null && currentCount <= limit;
    }
}
