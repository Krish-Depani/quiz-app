package dev.krish.quiz_app;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

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

		SpringApplication.run(QuizAppApplication.class, args);
	}

}
