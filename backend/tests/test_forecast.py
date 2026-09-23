import pandas as pd

from backend.app.services.forecast_service import (
    forecast_revenue
)


def test_revenue_forecast():
    data = {
        "date": [
            "2026-01-01",
            "2026-02-01",
            "2026-03-01",
            "2026-04-01",
        ],
        "quantity": [
            10,
            12,
            14,
            16,
        ],
        "price": [
            10000,
            10000,
            10000,
            10000,
        ],
    }

    dataframe = pd.DataFrame(data)

    result = forecast_revenue(
        dataframe,
        periods=3
    )

    assert isinstance(result, dict)
    assert "forecast" in result
    assert "model" in result

    assert isinstance(result["forecast"], list)
    assert len(result["forecast"]) == 3