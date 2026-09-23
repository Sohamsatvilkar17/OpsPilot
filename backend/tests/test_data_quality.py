import pandas as pd

from backend.app.services.data_quality_service import (
    check_data_quality
)


def test_data_quality_report():
    data = {
        "product": ["Laptop", "Mouse", "Laptop", None],
        "quantity": [2, 5, 2, 3],
        "price": [50000, 4000, 50000, 3000],
    }

    dataframe = pd.DataFrame(data)

    result = check_data_quality(dataframe)

    assert isinstance(result, dict)
    assert result["missing_values"] > 0
    assert result["duplicate_rows"] > 0
    