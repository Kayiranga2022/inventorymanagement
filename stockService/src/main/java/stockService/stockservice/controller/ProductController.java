package stockService.stockservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import stockService.stockservice.Entity.Product;
import stockService.stockservice.Service.ProductService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;
    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(@RequestBody Product product, Authentication authentication) {
        logger.info("Authenticated user for createProduct: {}", authentication);
        if (authentication != null && authentication.getAuthorities() != null) {
            logger.info("User authorities: {}", authentication.getAuthorities());
        } else {
            logger.warn("Authentication or authorities are null.");
        }
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts(Authentication authentication) {
        logger.info("Authenticated user for getAllProducts: {}", authentication);
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for getProductById: {}", authentication);
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<Product> getProductBySku(@PathVariable String sku, Authentication authentication) {
        logger.info("Authenticated user for getProductBySku: {}", authentication);
        return productService.getProductBySku(sku)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product, Authentication authentication) {
        logger.info("Authenticated user for updateProduct: {}", authentication);
        try {
            // Ensure the ID from the path variable is set in the product object.
            product.setId(id);
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, Authentication authentication) {
        logger.info("Authenticated user for deleteProduct: {}", authentication);
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
