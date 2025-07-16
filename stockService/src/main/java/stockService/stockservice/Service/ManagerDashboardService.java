package stockService.stockservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class ManagerDashboardService {

    @Autowired
    private StockService stockService;
    @Autowired
    private StockMovementService stockMovementService;

    public Map<String, Object> getManagerDashboardData() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalStocks", stockService.getTotalStockCount());
        data.put("lowStockAlerts", stockService.getLowStockAlertsCount());
       // data.put("stockMovements", stockMovementService.getTotalStockMovementsCount());
        //data.put("stockMovementsChartData", stockMovementService.getStockMovementsChartData());
        data.put("stockTrendsChartData", stockService.getStockTrends());
        return data;
    }
}