package com.devaraj.AIClone;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiCloneApplication {

    public static void main(String[] args) {
        // 1. Configure Dotenv to ignore missing file (for Render/Production)
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // 2. Set System Properties using a helper that checks .env FIRST, then System Environment
        setProp("GEMINI_API_KEY", dotenv);
        setProp("DB_URL", dotenv);
        setProp("DB_USER", dotenv);
        setProp("DB_PASSWORD", dotenv);
        setProp("FRONTEND_URL", dotenv);
        setProp("JWT_SECRET", dotenv);
        setProp("JWT_EXPIRATION_MS", dotenv);
        setProp("GOOGLE_CLIENT_ID", dotenv);
        setProp("GOOGLE_CLIENT_SECRET", dotenv);

        // 3. Safe logging for debugging
        String apiKey = System.getProperty("GEMINI_API_KEY");
        if (apiKey != null && apiKey.length() > 12) {
            System.out.println("Loading Gemini API Key starting with: " + apiKey.substring(0, 12));
        } else {
            System.out.println("Warning: GEMINI_API_KEY is not set or is too short.");
        }

        SpringApplication.run(AiCloneApplication.class, args);
    }

    /**
     * Helper method to bridge the gap between .env files (local) 
     * and Environment Variables (Render/Production).
     */
    private static void setProp(String key, Dotenv dotenv) {
        // Try to get from .env file
        String value = dotenv.get(key);
        
        // If not in .env, try to get from System Environment (Render dashboard)
        if (value == null) {
            value = System.getenv(key);
        }
        
        // If we found a value, set it so Spring Boot can find it
        if (value != null) {
            System.setProperty(key, value);
        }
    }
}
