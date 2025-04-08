package com.drones.fct.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

  @Bean
  OpenAPI customOpenAPI() {
    return new OpenAPI()
        .addServersItem(new Server().url("http://localhost:8080").description("Local environment"))
        .info(new Info()
            .title("🛩️ Drone Flight Coordination API")
            .version("1.0")
            .description("""
                System for coordinating autonomous drones on observation missions.
                - Flight matrix management
                - Execution of safe movements
                - Real-time collision detection
                """));

  }
}