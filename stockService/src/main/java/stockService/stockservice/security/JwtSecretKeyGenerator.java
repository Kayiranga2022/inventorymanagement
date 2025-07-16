package stockService.stockservice.security;

import java.util.Base64;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

public class JwtSecretKeyGenerator {
    public static void main(String[] args) {
        byte[] keyBytes = new byte[64]; // 64 bytes for HS512
        new java.security.SecureRandom().nextBytes(keyBytes);
        String secretKey = Base64.getEncoder().encodeToString(keyBytes);
        System.out.println("Generated Secret Key: " + secretKey);
    }
}
