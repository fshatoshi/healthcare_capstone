package com.healthtrack.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@SpringBootApplication
@EnableMongoAuditing
public class HealthTrackApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthTrackApiApplication.class, args);
	}

}
