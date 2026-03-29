package com.rawat.mvc.configurations;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
public class ProjectConfigurations {
    @Bean
    public ModelMapper mapper(){
        return new ModelMapper();
    }
}
