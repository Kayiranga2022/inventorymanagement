package stockService.stockservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@ComponentScan("stockService.stockservice.controller")
@ComponentScan("stockService.stockservice")
public class StockServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(StockServiceApplication.class, args);
	}
}


