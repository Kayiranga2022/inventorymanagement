/*

package stockService.stockservice.Service;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import stockService.stockservice.Entity.StockMovement;
import stockService.stockservice.dto.StockMovementReportRequest;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class StockMovementReportService {

    private final StockMovementService stockMovementService;

    public StockMovementReportService(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @SneakyThrows
    public byte[] generateStockMovementReport(StockMovementReportRequest request) {
        List<StockMovement> stockMovements = stockMovementService.getStockMovementReport(request);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(byteArrayOutputStream);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Title
        document.add(new Paragraph("Stock Movement Report")
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setFontSize(16));

        document.add(new Paragraph("Generated Report")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(12));

        document.add(new Paragraph("\n"));

        // Create Table
        Table table = new Table(new float[]{2, 3, 2, 2, 3});
        table.setWidth(UnitValue.createPercentValue(100));

        // Table Headers
        table.addCell(new Cell().add(new Paragraph("ID")).setBold());
        table.addCell(new Cell().add(new Paragraph("Stock Name")).setBold());
        table.addCell(new Cell().add(new Paragraph("Movement Type")).setBold());
        table.addCell(new Cell().add(new Paragraph("Quantity")).setBold());
        table.addCell(new Cell().add(new Paragraph("Timestamp")).setBold());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Populate Table with Data
        if (stockMovements.isEmpty()) {
            table.addCell(new Cell(1, 5).add(new Paragraph("No stock movements found for the selected filters.")
                    .setTextAlignment(TextAlignment.CENTER)));
        } else {
            for (StockMovement movement : stockMovements) {
                table.addCell(new Cell().add(new Paragraph(movement.getId().toString())));

                // Ensure stock is not null
                table.addCell(new Cell().add(new Paragraph(movement.getStock() != null ?
                        movement.getStock().getName() : "N/A")));

                // Ensure movement type is not null
                table.addCell(new Cell().add(new Paragraph(movement.getMovementType() != null ?
                        movement.getMovementType().toString() : "N/A")));

                table.addCell(new Cell().add(new Paragraph(String.valueOf(movement.getQuantity()))));

                // Ensure timestamp is not null
                table.addCell(new Cell().add(new Paragraph(movement.getTimestamp() != null ?
                        movement.getTimestamp().format(formatter) : "N/A")));
            }
        }

        document.add(table);
        document.close();

        // Debugging: Save PDF to a local file for verification
        try (FileOutputStream fos = new FileOutputStream("stock_movement_report.pdf")) {
            fos.write(byteArrayOutputStream.toByteArray());
        }

        return byteArrayOutputStream.toByteArray();
    }
}
*/
package stockService.stockservice.Service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stockService.stockservice.Entity.StockMovement;
import stockService.stockservice.Repository.StockMovementRepository;
import stockService.stockservice.dto.StockMovementReportRequest;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class StockMovementReportService {

    private final StockMovementRepository stockMovementRepository;

    @Autowired
    public StockMovementReportService(StockMovementRepository stockMovementRepository) {
        this.stockMovementRepository = stockMovementRepository;
    }

    @SneakyThrows
    public byte[] generateStockMovementReport(StockMovementReportRequest request) {
        List<StockMovement> stockMovements = stockMovementRepository.findAll(); //get all since the filter is not yet implemented.

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(byteArrayOutputStream);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // ... (your report generation code) ...

        document.close();

        // Debugging: Save PDF to a local file for verification
        try (FileOutputStream fos = new FileOutputStream("stock_movement_report.pdf")) {
            fos.write(byteArrayOutputStream.toByteArray());
        }

        return byteArrayOutputStream.toByteArray();
    }

    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository.findAll();
    }

    public List<StockMovement> getStockMovementsByStockId(Long stockId) {
        return stockMovementRepository.findByStock_Id(stockId);
    }

    public Optional<StockMovement> getStockMovementById(Long id) {
        return stockMovementRepository.findById(id);
    }
}