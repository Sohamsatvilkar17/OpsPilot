import pandas as pd


def check_data_quality(df):
    total_cells = df.shape[0] * df.shape[1]

    missing_values = int(df.isnull().sum().sum())
    duplicate_rows = int(df.duplicated().sum())

    negative_values = 0

    numeric_columns = df.select_dtypes(
        include=["number"]
    ).columns

    if len(numeric_columns) > 0:
        negative_values = int(
            (df[numeric_columns] < 0).sum().sum()
        )

    invalid_dates = 0

    if "date" in df.columns:
        converted_dates = pd.to_datetime(
            df["date"],
            errors="coerce"
        )

        invalid_dates = int(
            converted_dates.isnull().sum()
        )

    quality_score = 100

    if total_cells > 0:
        missing_percentage = (
            missing_values / total_cells
        ) * 100

        duplicate_percentage = (
            duplicate_rows / len(df)
        ) * 100 if len(df) > 0 else 0

        quality_score -= missing_percentage
        quality_score -= duplicate_percentage

    quality_score = max(
        0,
        round(quality_score, 2)
    )

    return {
        "quality_score": quality_score,
        "total_rows": len(df),
        "total_columns": len(df.columns),
        "missing_values": missing_values,
        "duplicate_rows": duplicate_rows,
        "negative_values": negative_values,
        "invalid_dates": invalid_dates
    }