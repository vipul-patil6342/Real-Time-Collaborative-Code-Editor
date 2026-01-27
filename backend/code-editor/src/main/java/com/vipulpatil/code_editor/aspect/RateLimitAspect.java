package com.vipulpatil.code_editor.aspect;

import com.vipulpatil.code_editor.annotation.RateLimit;
import com.vipulpatil.code_editor.service.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Aspect
@Configuration
@RequiredArgsConstructor
public class RateLimitAspect {

    private final RateLimitService rateLimitService;
    private final HttpServletRequest request;

    @Around("@annotation(rateLimit)")
    public Object checkLimit(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        String ip = request.getRemoteAddr();
        String key = joinPoint.getSignature().getName() + ":" + ip;

        if(rateLimitService.isAllowed(key, rateLimit.limit(), rateLimit.window())){
            return joinPoint.proceed();
        }else{
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too Many Requests!");
        }
    }
}
