package dev.krish.quiz_app;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Collections;
import java.util.Objects;

@SpringBootApplication
public class QuizAppApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

		System.setProperty("MYSQL_HOST", Objects.requireNonNull(dotenv.get("MYSQL_HOST")));
		System.setProperty("MYSQL_PORT", Objects.requireNonNull(dotenv.get("MYSQL_PORT")));
		System.setProperty("MYSQL_DATABASE", Objects.requireNonNull(dotenv.get("MYSQL_DATABASE")));
		System.setProperty("MYSQL_USER", Objects.requireNonNull(dotenv.get("MYSQL_USER")));
		System.setProperty("MYSQL_PASSWORD", Objects.requireNonNull(dotenv.get("MYSQL_PASSWORD")));
		System.setProperty("JWT_SECRET", Objects.requireNonNull(dotenv.get("JWT_SECRET")));
		System.setProperty("JWT_EXPIRATION", Objects.requireNonNull(dotenv.get("JWT_EXPIRATION")));

		SpringApplication.run(QuizAppApplication.class, args);
	}

	// CORS configuration
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));  // Frontend URL
		configuration.setAllowedMethods(Collections.singletonList("*"));  // Allow all methods (GET, POST, etc.)
		configuration.setAllowedHeaders(Collections.singletonList("*"));  // Allow all headers
		configuration.setAllowCredentials(true);  // Allow credentials (cookies, tokens)

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);  // Apply CORS to all endpoints

		return source;
	}

	@Bean
	public CorsFilter corsFilter() {
		return new CorsFilter(corsConfigurationSource());
	}
}
