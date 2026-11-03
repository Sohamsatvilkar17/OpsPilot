from pathlib import Path

import pandas as pd


ALLOWED_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".json"
}


COLUMN_ALIASES = {
    "date": [
        "date",
        "order_date",
        "transaction_date",
        "sale_date",
        "orderdate",
        "transactiondate"
    ],

    "product": [
        "product",
        "product_name",
        "item",
        "item_name",
        "productname"
    ],

    "category": [
        "category",
        "product_category",
        "productcategory"
    ],

    "price": [
        "price",
        "unit_price",
        "unitprice",
        "selling_price",
        "sale_price"
    ],

    "quantity": [
        "quantity",
        "qty",
        "quantity_sold",
        "units",
        "units_sold"
    ],

    "revenue": [
        "revenue",
        "sales",
        "sales_amount",
        "salesamount",
        "total_sales",
        "total_revenue"
    ],

    "profit": [
        "profit",
        "profit_amount",
        "net_profit"
    ],

    "cost": [
        "cost",
        "cost_amount",
        "cost_price"
    ]
}


def clean_column_name(column_name):
    """
    Convert a column name into a standard format.
    """

    return (
        str(column_name)
        .strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
    )


def normalize_columns(df):
    """
    Convert common Kaggle column names
    into OpsPilot standard names.
    """

    rename_map = {}

    existing_columns = {
        clean_column_name(column): column
        for column in df.columns
    }

    for standard_name, aliases in COLUMN_ALIASES.items():

        if standard_name in existing_columns:
            continue

        for alias in aliases:

            cleaned_alias = clean_column_name(alias)

            if cleaned_alias in existing_columns:

                original_column = existing_columns[
                    cleaned_alias
                ]

                rename_map[
                    original_column
                ] = standard_name

                break

    df = df.rename(
        columns=rename_map
    )

    return df


def normalize_dataset(df):
    """
    Prepare uploaded data for OpsPilot analytics.
    """

    df = normalize_columns(df)

    # Convert dates
    if "date" in df.columns:

        df["date"] = pd.to_datetime(
            df["date"],
            errors="coerce"
        )

    # Convert numeric columns
    numeric_columns = [
        "quantity",
        "price",
        "revenue",
        "profit",
        "cost"
    ]

    for column in numeric_columns:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # If revenue is not available,
    # calculate it from quantity × price.
    if (
        "revenue" not in df.columns
        and "quantity" in df.columns
        and "price" in df.columns
    ):

        df["revenue"] = (
            df["quantity"]
            * df["price"]
        )

    return df


def read_dataset(file_path: str):

    path = Path(file_path)

    if path.suffix.lower() not in ALLOWED_EXTENSIONS:

        raise ValueError(
            "Unsupported file type. "
            "Only CSV, Excel and JSON files are supported."
        )

    if path.suffix.lower() == ".csv":

        dataframe = pd.read_csv(
            path
        )

    elif path.suffix.lower() == ".xlsx":

        dataframe = pd.read_excel(
            path
        )

    elif path.suffix.lower() == ".json":

        dataframe = pd.read_json(
            path
        )

    else:

        raise ValueError(
            "Unable to read dataset."
        )

    return normalize_dataset(
        dataframe
    )


def get_dataset_info(df):

    return {
        "rows": len(df),

        "columns": len(
            df.columns
        ),

        "column_names": list(
            df.columns
        ),

        "missing_values": int(
            df.isnull()
            .sum()
            .sum()
        ),

        "duplicate_rows": int(
            df.duplicated()
            .sum()
        )
    }