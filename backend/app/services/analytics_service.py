import pandas as pd


def calculate_business_metrics(df):

    required_columns = {
        "quantity",
        "price"
    }

    missing_columns = required_columns - set(df.columns)

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {', '.join(missing_columns)}"
        )

    df = df.copy()

    # Calculate revenue
    df["revenue"] = df["quantity"] * df["price"]

    total_revenue = df["revenue"].sum()

    total_units = df["quantity"].sum()

    average_order_value = df["revenue"].mean()

    # Product revenue
    product_revenue = (
        df.groupby("product")["revenue"]
        .sum()
        .sort_values(ascending=False)
    )

    best_product = (
        product_revenue.index[0]
        if not product_revenue.empty
        else None
    )

    top_products = {
        product: float(revenue)
        for product, revenue in product_revenue.head(3).items()
    }

    # Estimated profit
    estimated_profit = total_revenue * 0.20

    profit_margin = (
        (estimated_profit / total_revenue) * 100
        if total_revenue > 0
        else 0
    )

    # Monthly revenue
    monthly_revenue = {}

    # Product growth analysis
    product_growth = {}
    growth_contributors = []

    if "date" in df.columns:

        df["date"] = pd.to_datetime(
            df["date"],
            errors="coerce"
        )

        valid_date_data = df.dropna(
            subset=["date"]
        ).copy()

        # Monthly revenue
        monthly_data = (
            valid_date_data
            .groupby(
                valid_date_data["date"].dt.to_period("M")
            )["revenue"]
            .sum()
            .sort_index()
        )

        monthly_revenue = {
            str(month): float(revenue)
            for month, revenue in monthly_data.items()
        }

        # Product revenue by month
        if "product" in valid_date_data.columns:

            product_monthly = (
                valid_date_data
                .groupby(
                    [
                        valid_date_data["date"].dt.to_period("M"),
                        "product"
                    ]
                )["revenue"]
                .sum()
                .unstack(fill_value=0)
                .sort_index()
            )

            # Compare the latest month with the previous month
            if len(product_monthly) >= 2:

                previous_month = product_monthly.index[-2]
                current_month = product_monthly.index[-1]

                previous_values = product_monthly.loc[
                    previous_month
                ]

                current_values = product_monthly.loc[
                    current_month
                ]

                all_products = sorted(
                    set(previous_values.index)
                    | set(current_values.index)
                )

                for product in all_products:

                    previous_value = float(
                        previous_values.get(product, 0)
                    )

                    current_value = float(
                        current_values.get(product, 0)
                    )

                    change = current_value - previous_value

                    if previous_value > 0:
                        growth_percentage = (
                            change / previous_value
                        ) * 100
                    elif current_value > 0:
                        growth_percentage = 100
                    else:
                        growth_percentage = 0

                    product_growth[product] = {
                        "previous_month_revenue": round(
                            previous_value,
                            2
                        ),
                        "current_month_revenue": round(
                            current_value,
                            2
                        ),
                        "revenue_change": round(
                            change,
                            2
                        ),
                        "growth_percentage": round(
                            growth_percentage,
                            2
                        )
                    }

                # Products that contributed positively
                # to the latest month's revenue change
                for product, values in product_growth.items():

                    if values["revenue_change"] > 0:

                        growth_contributors.append({
                            "product": product,
                            "revenue_change": values[
                                "revenue_change"
                            ],
                            "growth_percentage": values[
                                "growth_percentage"
                            ]
                        })

                growth_contributors.sort(
                    key=lambda item: item["revenue_change"],
                    reverse=True
                )

    # Revenue growth
    revenue_growth = 0

    if len(monthly_revenue) >= 2:

        values = list(monthly_revenue.values())

        previous_revenue = values[-2]

        current_revenue = values[-1]

        if previous_revenue > 0:

            revenue_growth = (
                (current_revenue - previous_revenue)
                / previous_revenue
            ) * 100

    product_revenue = {
        product: float(revenue)
        for product, revenue in product_revenue.items()
    }

    return {
        "total_revenue": float(total_revenue),

        "total_units_sold": int(total_units),

        "average_order_value": float(
            average_order_value
        ),

        "estimated_profit": float(
            estimated_profit
        ),

        "profit_margin": round(
            float(profit_margin),
            2
        ),

        "revenue_growth": round(
            float(revenue_growth),
            2
        ),

        "best_selling_product": best_product,

        "top_products": top_products,

        "revenue_by_product": product_revenue,

        "monthly_revenue": monthly_revenue,

        "product_growth": product_growth,

        "growth_contributors": growth_contributors
    }