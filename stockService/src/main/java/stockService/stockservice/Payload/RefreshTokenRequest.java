package stockService.stockservice.Payload;

public class RefreshTokenRequest {

    private String refreshToken;

    // Default constructor (required for JSON deserialization)
    public RefreshTokenRequest() {}

    public RefreshTokenRequest(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}