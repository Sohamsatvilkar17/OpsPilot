import json
from pathlib import Path

import pandas as pd


ALLOWED_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".json"
}


def read_dataset(file_path: str):
    path = Path(file_path)

    if path.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise ValueError("Unsupported file type")

    if path.suffix.lower() == ".csv":
        return pd.read_csv(path)

    if path.suffix.lower() == ".xlsx":
        return pd.read_excel(path)

    if path.suffix.lower() == ".json":
        return pd.read_json(path)

    raise ValueError("Unable to read dataset")


def get_dataset_info(df):
    return {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "missing_values": int(df.isnull().sum().sum()),
        "duplicate_rows": int(df.duplicated().sum())
    }