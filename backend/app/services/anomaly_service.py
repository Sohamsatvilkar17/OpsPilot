import math

import pandas as pd
from sklearn.ensemble import IsolationForest


def detect_anomalies(df):

    dataframe = df.copy()

    numeric_columns = dataframe.select_dtypes(
        include=["number"]
    ).columns.tolist()

    if len(numeric_columns) < 1:
        return {
            "anomalies_detected": 0,
            "anomaly_percentage": 0,
            "anomalies": []
        }

    model_data = dataframe[numeric_columns].copy()

    model_data = model_data.fillna(
        model_data.median()
    )

    model_data = model_data.fillna(0)

    model = IsolationForest(
        contamination="auto",
        random_state=42
    )

    predictions = model.fit_predict(model_data)

    dataframe["anomaly"] = predictions

    anomalies = dataframe[
        dataframe["anomaly"] == -1
    ].copy()

    anomaly_records = []

    for _, row in anomalies.iterrows():

        record = {}

        for column in dataframe.columns:

            if column == "anomaly":
                continue

            value = row[column]

            if pd.isna(value):
                record[column] = None

            elif isinstance(value, float):

                if not math.isfinite(value):
                    record[column] = None
                else:
                    record[column] = value

            else:
                record[column] = value

        anomaly_records.append(record)

    anomaly_count = len(anomaly_records)

    total_rows = len(dataframe)

    anomaly_percentage = (
        (anomaly_count / total_rows) * 100
        if total_rows > 0
        else 0
    )

    return {
        "anomalies_detected": anomaly_count,
        "anomaly_percentage": round(
            anomaly_percentage,
            2
        ),
        "anomalies": anomaly_records
    }