import pandas as pd


def prepare_dataframe(df):
    """
    Prepare the dataframe for OpsPilot analytics.

    The upload service normally handles column
    normalization. This function keeps a small
    safety layer in case analytics receives a
    dataframe directly.
    """

    df = df.copy()

    # Normalize column names
    df.columns = [
        str(column)
        .strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
        for column in df.columns
    ]

    # Common column mappings
    rename_map = {
        "order_date": "date",
        "transaction_date": "date",
        "sale_date": "date",

        "product_name": "product",
        "item_name": "product",

        "product_category": "category",

        "unit_price": "price",
        "unitprice": "price",
        "selling_price": "price",

        "sales_amount": "revenue",
        "sales": "revenue",
        "total_sales": "revenue",
        "total_revenue": "revenue",

        "cost_amount": "cost",
        "cost_price": "cost",

        "quantity_sold": "quantity",
        "qty": "quantity",
        "units": "quantity",
        "units_sold": "quantity",

        "profit_amount": "profit",
        "net_profit": "profit"
    }

    df = df.rename(
        columns=rename_map
    )

    # Convert date
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

    # Remove completely invalid quantity rows
    if "quantity" in df.columns:

        df = df[
            df["quantity"].notna()
        ]

    # Remove completely invalid price rows
    if "price" in df.columns:

        df = df[
            df["price"].notna()
        ]

    # Use existing revenue whenever available.
    #
    # Only calculate revenue when the dataset
    # does not already provide a revenue column.
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


def calculate_business_metrics(df):
    """
    Calculate important business metrics
    from the uploaded dataset.
    """

    df = prepare_dataframe(
        df
    )

    # -----------------------------------
    # Required columns
    # -----------------------------------

    required_columns = [
        "quantity",
        "price"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:

        raise ValueError(
            "Missing required columns: "
            + ", ".join(
                missing_columns
            )
        )

    if "revenue" not in df.columns:

        raise ValueError(
            "Missing required column: revenue"
        )

    # -----------------------------------
    # Clean revenue
    # -----------------------------------

    df["revenue"] = pd.to_numeric(
        df["revenue"],
        errors="coerce"
    )

    df = df[
        df["revenue"].notna()
    ]

    # -----------------------------------
    # Basic metrics
    # -----------------------------------

    total_revenue = float(
        df["revenue"].sum()
    )

    total_units = float(
        df["quantity"].sum()
    )

    transaction_count = len(
        df
    )

    # Average order value
    if transaction_count > 0:

        average_order_value = (
            total_revenue
            / transaction_count
        )

    else:

        average_order_value = 0

    # -----------------------------------
    # Profit
    # -----------------------------------

    if "profit" in df.columns:

        profit_values = pd.to_numeric(
            df["profit"],
            errors="coerce"
        )

        estimated_profit = float(
            profit_values
            .fillna(0)
            .sum()
        )

    elif "cost" in df.columns:

        cost_values = pd.to_numeric(
            df["cost"],
            errors="coerce"
        )

        total_cost = float(
            cost_values
            .fillna(0)
            .sum()
        )

        estimated_profit = (
            total_revenue
            - total_cost
        )

    else:

        # If profit/cost does not exist,
        # use a simple estimated margin.
        estimated_profit = (
            total_revenue * 0.20
        )

    # -----------------------------------
    # Profit margin
    # -----------------------------------

    if total_revenue > 0:

        profit_margin = (
            estimated_profit
            / total_revenue
        ) * 100

    else:

        profit_margin = 0

    # -----------------------------------
    # Revenue growth
    # -----------------------------------

    revenue_growth = 0

    if "date" in df.columns:

        monthly_data = (
            df.dropna(
                subset=["date"]
            )
            .groupby(
                df["date"].dt.to_period("M")
            )["revenue"]
            .sum()
        )

        if len(monthly_data) >= 2:

            previous_month = float(
                monthly_data.iloc[-2]
            )

            current_month = float(
                monthly_data.iloc[-1]
            )

            if previous_month != 0:

                revenue_growth = (
                    (
                        current_month
                        - previous_month
                    )
                    / previous_month
                ) * 100

    # -----------------------------------
    # Best selling product
    # -----------------------------------

    best_selling_product = None

    if "product" in df.columns:

        product_revenue = (
            df.groupby(
                "product"
            )["revenue"]
            .sum()
            .sort_values(
                ascending=False
            )
        )

        if not product_revenue.empty:

            best_selling_product = (
                str(
                    product_revenue.index[0]
                )
            )

    else:

        product_revenue = pd.Series(
            dtype=float
        )

    # -----------------------------------
    # Top products
    # -----------------------------------

    top_products = []

    if not product_revenue.empty:

        for product, revenue in (
            product_revenue
            .head(10)
            .items()
        ):

            top_products.append(
                {
                    "product": str(
                        product
                    ),
                    "revenue": round(
                        float(revenue),
                        2
                    )
                }
            )

    # -----------------------------------
    # Revenue by category
    # -----------------------------------

    revenue_by_category = []

    if "category" in df.columns:

        category_revenue = (
            df.groupby(
                "category"
            )["revenue"]
            .sum()
            .sort_values(
                ascending=False
            )
        )

        for category, revenue in (
            category_revenue
            .items()
        ):

            revenue_by_category.append(
                {
                    "category": str(
                        category
                    ),
                    "revenue": round(
                        float(revenue),
                        2
                    )
                }
            )

    # -----------------------------------
    # Monthly revenue
    # -----------------------------------

    monthly_revenue = []

    if "date" in df.columns:

        monthly_data = (
            df.dropna(
                subset=["date"]
            )
            .groupby(
                df["date"].dt.to_period("M")
            )["revenue"]
            .sum()
        )

        for month, revenue in (
            monthly_data.items()
        ):

            monthly_revenue.append(
                {
                    "month": str(
                        month
                    ),
                    "revenue": round(
                        float(revenue),
                        2
                    )
                }
            )

    # -----------------------------------
    # Product growth
    # -----------------------------------

    product_growth = []

    if (
        "product" in df.columns
        and "date" in df.columns
    ):

        temp_df = df.dropna(
            subset=[
                "date",
                "product"
            ]
        ).copy()

        temp_df["month"] = (
            temp_df["date"]
            .dt.to_period("M")
        )

        product_monthly = (
            temp_df.groupby(
                [
                    "product",
                    "month"
                ]
            )["revenue"]
            .sum()
            .reset_index()
        )

        for product in (
            product_monthly["product"]
            .unique()
        ):

            product_data = (
                product_monthly[
                    product_monthly[
                        "product"
                    ] == product
                ]
                .sort_values("month")
            )

            if len(product_data) < 2:
                continue

            previous_revenue = float(
                product_data[
                    "revenue"
                ].iloc[-2]
            )

            current_revenue = float(
                product_data[
                    "revenue"
                ].iloc[-1]
            )

            if previous_revenue != 0:

                growth = (
                    (
                        current_revenue
                        - previous_revenue
                    )
                    / previous_revenue
                ) * 100

            else:

                growth = 0

            product_growth.append(
                {
                    "product": str(
                        product
                    ),
                    "previous_revenue": round(
                        previous_revenue,
                        2
                    ),
                    "current_revenue": round(
                        current_revenue,
                        2
                    ),
                    "growth_percentage": round(
                        float(growth),
                        2
                    )
                }
            )

    # -----------------------------------
    # Growth contributors
    # -----------------------------------

    growth_contributors = []

    if product_growth:

        positive_growth = [
            item
            for item in product_growth
            if item[
                "current_revenue"
            ]
            > item[
                "previous_revenue"
            ]
        ]

        total_growth = sum(
            item[
                "current_revenue"
            ]
            - item[
                "previous_revenue"
            ]
            for item in positive_growth
        )

        for item in positive_growth:

            increase = (
                item[
                    "current_revenue"
                ]
                - item[
                    "previous_revenue"
                ]
            )

            if total_growth > 0:

                contribution = (
                    increase
                    / total_growth
                ) * 100

            else:

                contribution = 0

            growth_contributors.append(
                {
                    "product": item[
                        "product"
                    ],
                    "revenue_increase": round(
                        float(increase),
                        2
                    ),
                    "contribution_percentage": round(
                        float(contribution),
                        2
                    )
                }
            )

        growth_contributors.sort(
            key=lambda item:
            item[
                "revenue_increase"
            ],
            reverse=True
        )

    # -----------------------------------
    # Final response
    # -----------------------------------

    return {
        "total_revenue": round(
            total_revenue,
            2
        ),

        "total_units_sold": round(
            total_units,
            2
        ),

        "average_order_value": round(
            average_order_value,
            2
        ),

        "estimated_profit": round(
            estimated_profit,
            2
        ),

        "profit_margin": round(
            profit_margin,
            2
        ),

        "revenue_growth": round(
            revenue_growth,
            2
        ),

        "best_selling_product":
            best_selling_product,

        "top_products":
            top_products,

        "revenue_by_category":
            revenue_by_category,

        "monthly_revenue":
            monthly_revenue,

        "product_growth":
            product_growth,

        "growth_contributors":
            growth_contributors
    }