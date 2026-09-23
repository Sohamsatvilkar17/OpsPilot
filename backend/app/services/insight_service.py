def generate_insights(
    metrics,
    quality_report,
    anomaly_report
):
    insights = []

    total_revenue = metrics.get(
        "total_revenue",
        0
    )

    total_units = metrics.get(
        "total_units_sold",
        0
    )

    average_order_value = metrics.get(
        "average_order_value",
        0
    )

    best_product = metrics.get(
        "best_selling_product",
        "Unknown"
    )

    revenue_growth = metrics.get(
        "revenue_growth",
        0
    )

    quality_score = quality_report.get(
        "quality_score",
        0
    )

    missing_values = quality_report.get(
        "missing_values",
        0
    )

    duplicate_rows = quality_report.get(
        "duplicate_rows",
        0
    )

    invalid_dates = quality_report.get(
        "invalid_dates",
        0
    )

    anomaly_records = anomaly_report.get(
        "anomaly_records",
        0
    )

    anomaly_percentage = anomaly_report.get(
        "anomaly_percentage",
        0
    )


    # Revenue insight
    if revenue_growth > 0:
        insights.append({
            "type": "positive",
            "title": "Revenue Growth",
            "message": (
                f"Revenue is showing positive growth of "
                f"{revenue_growth}% compared with the "
                f"previous month."
            )
        })

    elif revenue_growth < 0:
        insights.append({
            "type": "warning",
            "title": "Revenue Decline",
            "message": (
                f"Revenue decreased by "
                f"{abs(revenue_growth)}% compared with "
                f"the previous month. Review sales "
                f"performance and customer demand."
            )
        })

    else:
        insights.append({
            "type": "info",
            "title": "Revenue Trend",
            "message": (
                "There is not enough historical information "
                "to identify a significant revenue trend."
            )
        })


    # Product insight
    if best_product != "Unknown":
        insights.append({
            "type": "positive",
            "title": "Top Product",
            "message": (
                f"{best_product} is the highest "
                f"revenue-generating product in the dataset. "
                f"Consider prioritizing it for inventory "
                f"and marketing."
            )
        })


    # Business volume insight
    insights.append({
        "type": "info",
        "title": "Business Volume",
        "message": (
            f"The dataset contains {total_units:,} units "
            f"sold with total revenue of "
            f"₹{total_revenue:,.0f}. "
            f"The average order value is "
            f"₹{average_order_value:,.0f}."
        )
    })


    # Data quality insight
    if quality_score >= 90:
        insights.append({
            "type": "positive",
            "title": "Data Quality",
            "message": (
                f"The dataset has a strong quality score "
                f"of {quality_score}%. "
                f"No major data-quality concerns were detected."
            )
        })

    elif quality_score >= 70:
        insights.append({
            "type": "warning",
            "title": "Data Quality",
            "message": (
                f"The dataset has a quality score of "
                f"{quality_score}%. "
                f"Some data-cleaning improvements are recommended."
            )
        })

    else:
        insights.append({
            "type": "warning",
            "title": "Data Quality Risk",
            "message": (
                f"The dataset quality score is only "
                f"{quality_score}%. "
                f"Important data-cleaning work should be completed "
                f"before making major business decisions."
            )
        })


    # Data problems
    if missing_values > 0:
        insights.append({
            "type": "warning",
            "title": "Missing Data",
            "message": (
                f"{missing_values} missing values were detected. "
                f"Review these records before analysis."
            )
        })


    if duplicate_rows > 0:
        insights.append({
            "type": "warning",
            "title": "Duplicate Records",
            "message": (
                f"{duplicate_rows} duplicate rows were detected. "
                f"Removing duplicate records may improve "
                f"analysis accuracy."
            )
        })


    if invalid_dates > 0:
        insights.append({
            "type": "warning",
            "title": "Invalid Dates",
            "message": (
                f"{invalid_dates} invalid date values were detected. "
                f"These records should be reviewed."
            )
        })


    # Anomaly insight
    if anomaly_records > 0:
        insights.append({
            "type": "warning",
            "title": "Anomaly Detection",
            "message": (
                f"The ML model detected {anomaly_records} "
                f"unusual records, representing "
                f"{anomaly_percentage}% of the dataset. "
                f"These transactions should be investigated."
            )
        })

    else:
        insights.append({
            "type": "positive",
            "title": "Anomaly Detection",
            "message": (
                "No significant unusual transactions "
                "were detected by the ML anomaly detection model."
            )
        })


    # Recommendation
    recommendations = []

    if best_product != "Unknown":
        recommendations.append(
            f"Promote {best_product}"
        )

    if revenue_growth > 0:
        recommendations.append(
            "continue monitoring the current growth trend"
        )

    if revenue_growth < 0:
        recommendations.append(
            "review the recent revenue decline"
        )

    if quality_score < 90:
        recommendations.append(
            "improve data quality"
        )

    if anomaly_records > 0:
        recommendations.append(
            "investigate unusual transactions"
        )


    if recommendations:
        recommendation_text = (
            "Recommended actions: "
            + ", ".join(recommendations)
            + "."
        )
    else:
        recommendation_text = (
            "The business data appears healthy. "
            "Continue monitoring performance regularly."
        )


    insights.append({
        "type": "recommendation",
        "title": "Business Recommendation",
        "message": recommendation_text
    })


    return insights