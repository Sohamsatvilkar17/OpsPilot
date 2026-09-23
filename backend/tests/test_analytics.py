import pandas as pd

from backend.app.services.analytics_service import (
    calculate_business_metrics
)


def test_business_metrics():
    data = {
        "product": ["Laptop", "Mouse", "Laptop"],
        "quantity": [2, 5, 3],
        "price": [50000, 4000, 50000],
    }

    dataframe = pd.DataFrame(data)

    result = calculate_business_metrics(dataframe)

    assert result["total_revenue"] == 270000
    assert result["total_units_sold"] == 10
    assert result["average_order_value"] == 90000