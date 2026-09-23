import pandas as pd
from sklearn.linear_model import LinearRegression


def forecast_revenue(df, periods=3):

    if "date" not in df.columns:
        raise ValueError(
            "Date column is required for revenue forecasting."
        )

    if "quantity" not in df.columns:
        raise ValueError(
            "Quantity column is required for revenue forecasting."
        )

    if "price" not in df.columns:
        raise ValueError(
            "Price column is required for revenue forecasting."
        )

    data = df.copy()

    data["date"] = pd.to_datetime(
        data["date"],
        errors="coerce"
    )

    data = data.dropna(
        subset=["date"]
    )

    data["revenue"] = (
        data["quantity"] * data["price"]
    )

    monthly_revenue = (
        data
        .groupby(
            data["date"].dt.to_period("M")
        )["revenue"]
        .sum()
        .reset_index()
    )

    if len(monthly_revenue) < 3:
        raise ValueError(
            "At least 3 months of data are required "
            "for revenue forecasting."
        )

    monthly_revenue["month_number"] = range(
        1,
        len(monthly_revenue) + 1
    )

    X = monthly_revenue[
        ["month_number"]
    ]

    y = monthly_revenue[
        "revenue"
    ]

    model = LinearRegression()

    model.fit(X, y)

    future_months = []

    last_month = (
        monthly_revenue["date"].iloc[-1]
    )

    for i in range(
        1,
        periods + 1
    ):
        future_period = (
            last_month + i
        )

        future_months.append(
            str(future_period)
        )

    future_numbers = [
        len(monthly_revenue) + i
        for i in range(
            1,
            periods + 1
        )
    ]

    predictions = model.predict(
        pd.DataFrame(
            {
                "month_number":
                    future_numbers
            }
        )
    )

    forecast = []

    for month, prediction in zip(
        future_months,
        predictions
    ):
        forecast.append(
            {
                "month": month,
                "predicted_revenue": round(
                    max(
                        0,
                        float(prediction)
                    ),
                    2
                )
            }
        )

    historical = []

    for _, row in monthly_revenue.iterrows():
        historical.append(
            {
                "month": str(row["date"]),
                "revenue": round(
                    float(row["revenue"]),
                    2
                )
            }
        )

    return {
        "historical": historical,
        "forecast": forecast,
        "model": "Linear Regression"
    }