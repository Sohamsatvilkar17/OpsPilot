import pandas as pd

from backend.app.services.analytics_service import (
    calculate_business_metrics
)
from backend.app.services.data_quality_service import (
    check_data_quality
)
from backend.app.services.anomaly_service import (
    detect_anomalies
)
from backend.app.services.alert_service import (
    generate_alerts
)


def test_alert_generation():
    data = {
        "product": [
            "Laptop",
            "Laptop",
            "Mouse",
            "Mouse",
        ],
        "quantity": [
            2,
            3,
            5,
            4,
        ],
        "price": [
            50000,
            50000,
            4000,
            4000,
        ],
    }

    dataframe = pd.DataFrame(data)

    metrics = calculate_business_metrics(dataframe)
    quality_report = check_data_quality(dataframe)
    anomaly_report = detect_anomalies(dataframe)

    result = generate_alerts(
        metrics,
        quality_report,
        anomaly_report
    )

    assert isinstance(result, list)