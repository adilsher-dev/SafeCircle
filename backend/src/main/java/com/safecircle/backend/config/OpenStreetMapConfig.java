package com.safecircle.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class OpenStreetMapConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}