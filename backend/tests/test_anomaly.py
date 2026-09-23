import pandas as pd

from backend.app.services.anomaly_service import (
    detect_anomalies
)


def test_anomaly_detection():
    data = {
        "product": [
            "Laptop",
            "Laptop",
            "Laptop",
            "Mouse",
            "Mouse",
            "Mouse",
        ],
        "quantity": [2, 2, 2, 3, 3, 30],
        "price": [50000, 50000, 50000, 4000, 4000, 4000],
    }

    dataframe = pd.DataFrame(data)

    result = detect_anomalies(dataframe)

    assert isinstance(result, dict)

    assert "anomalies_detected" in result
    assert "anomaly_percentage" in result
    assert "anomalies" in result

    assert result["anomalies_detected"] >= 0
    assert result["anomaly_percentage"] >= 0
    assert isinstance(result["anomalies"], list)