package com.vipulpatil.code_editor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Primary
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2); // Minimum threads to keep alive
        executor.setMaxPoolSize(10); // Maximum threads if busy
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("EmailThread-");
        executor.initialize();
        return executor;
    }
}
