def generate_chatbot_response(
    question,
    metrics,
    quality_report,
    anomaly_report,
    insights
):
    question = question.lower().strip()

    total_revenue = metrics.get("total_revenue", 0)
    total_units_sold = metrics.get("total_units_sold", 0)
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

    # Greeting
    if any(
        word in question
        for word in ["hello", "hi", "hey"]
    ):
        return (
            "Hello! 👋 I am your OpsPilot AI Assistant.\n\n"
            "I can analyze your business dataset and help "
            "you understand revenue, products, growth, "
            "data quality, anomalies, and recommendations."
        )

    # Complete business summary
    if (
        "summary" in question
        or "business performance" in question
        or "how is my business" in question
        or "how are we doing" in question
        or "complete analysis" in question
        or "overall performance" in question
    ):
        response = (
            "📊 BUSINESS PERFORMANCE SUMMARY\n\n"
            f"💰 Total Revenue: ₹{total_revenue:,.0f}\n"
            f"📦 Units Sold: {total_units_sold:,}\n"
            f"🏆 Best Product: {best_product}\n"
            f"💵 Average Order Value: "
            f"₹{average_order_value:,.0f}\n"
            f"📈 Revenue Growth: {revenue_growth}%\n"
            f"🔍 Data Quality: {quality_score}%\n"
            f"⚠️ Anomalies: {anomaly_records} "
            f"({anomaly_percentage}%)"
        )

        return response

    # Total revenue
    if any(
        word in question
        for word in [
            "total revenue",
            "revenue",
            "sales",
            "earnings"
        ]
    ):
        return (
            f"💰 The total revenue for this dataset is "
            f"₹{total_revenue:,.0f}."
        )

    # Best product
    if any(
        phrase in question
        for phrase in [
            "best product",
            "top product",
            "best selling",
            "highest product",
            "which product should i promote",
            "product should i promote"
        ]
    ):
        return (
            f"🏆 The best-selling product is "
            f"{best_product}.\n\n"
            f"💡 Recommendation: Consider prioritizing "
            f"{best_product} for inventory planning, "
            f"marketing campaigns, and promotions."
        )

    # Units sold
    if any(
        word in question
        for word in [
            "units",
            "quantity",
            "sold"
        ]
    ):
        return (
            f"📦 A total of {total_units_sold:,} "
            f"units were sold in this dataset."
        )

    # Average order value
    if any(
        phrase in question
        for phrase in [
            "average order",
            "order value",
            "aov"
        ]
    ):
        return (
            f"💵 The average order value is "
            f"₹{average_order_value:,.0f}."
        )

    # Revenue growth
    if any(
        word in question
        for word in [
            "growth",
            "increase",
            "decrease",
            "performance"
        ]
    ):
        if revenue_growth > 0:
            return (
                f"📈 Revenue is growing by "
                f"{revenue_growth}% compared with "
                f"the previous month.\n\n"
                "This indicates a positive sales trend."
            )

        if revenue_growth < 0:
            return (
                f"📉 Revenue has decreased by "
                f"{abs(revenue_growth)}% compared with "
                f"the previous month.\n\n"
                "You should review sales performance, "
                "pricing, and product demand."
            )

        return (
            "📊 There is not enough information to "
            "determine a significant revenue growth trend."
        )

    # Data quality
    if any(
        word in question
        for word in [
            "quality",
            "missing",
            "duplicate",
            "invalid"
        ]
    ):
        if quality_score >= 90:
            status = (
                "Excellent data quality. "
                "The dataset is in very good condition."
            )
        elif quality_score >= 70:
            status = (
                "The dataset has acceptable quality, "
                "but some improvements are recommended."
            )
        else:
            status = (
                "The dataset needs attention before "
                "important business decisions are made."
            )

        return (
            f"🔍 DATA QUALITY REPORT\n\n"
            f"Quality Score: {quality_score}%\n"
            f"Missing Values: {missing_values}\n"
            f"Duplicate Rows: {duplicate_rows}\n"
            f"Invalid Dates: {invalid_dates}\n\n"
            f"💡 {status}"
        )

    # Anomalies
    if any(
        word in question
        for word in [
            "anomaly",
            "anomalies",
            "unusual",
            "problem",
            "risk"
        ]
    ):
        if anomaly_records > 0:
            return (
                f"⚠️ I detected {anomaly_records} "
                f"unusual records.\n\n"
                f"Anomaly Rate: {anomaly_percentage}%\n\n"
                "💡 Recommendation: Review these records "
                "to determine whether they represent "
                "data errors, unusual transactions, "
                "or genuine business events."
            )

        return (
            "✅ Good news! No unusual records were "
            "detected in this dataset."
        )

    # What should I improve?
    if any(
        phrase in question
        for phrase in [
            "what should i improve",
            "what can i improve",
            "how can i improve",
            "improve my business",
            "improve performance"
        ]
    ):
        recommendations = []

        if best_product != "Unknown":
            recommendations.append(
                f"🎯 Promote {best_product}, "
                "your highest revenue-generating product."
            )

        if quality_score < 90:
            recommendations.append(
                "🔍 Improve data quality by reviewing "
                "missing values, duplicates, and invalid data."
            )

        if anomaly_percentage > 0:
            recommendations.append(
                "⚠️ Investigate unusual records detected "
                "by the anomaly detection system."
            )

        if revenue_growth < 0:
            recommendations.append(
                "📉 Review your sales strategy because "
                "revenue is currently declining."
            )

        if revenue_growth > 0:
            recommendations.append(
                "📈 Continue the current growth strategy "
                "while identifying the products driving growth."
            )

        if not recommendations:
            recommendations.append(
                "✅ Your business data looks healthy. "
                "Continue monitoring revenue, products, "
                "and data quality."
            )

        return (
            "💡 BUSINESS IMPROVEMENT RECOMMENDATIONS\n\n"
            + "\n".join(recommendations)
        )

    # Recommendations
    if any(
        word in question
        for word in [
            "recommend",
            "recommendation",
            "suggest",
            "advice"
        ]
    ):
        recommendations = []

        if best_product != "Unknown":
            recommendations.append(
                f"🎯 Focus marketing and inventory "
                f"planning on {best_product}."
            )

        if quality_score < 90:
            recommendations.append(
                "🔍 Improve the dataset quality."
            )

        if anomaly_percentage > 0:
            recommendations.append(
                "⚠️ Review the unusual records."
            )

        if revenue_growth < 0:
            recommendations.append(
                "📉 Investigate the recent revenue decline."
            )

        if revenue_growth > 0:
            recommendations.append(
                "📈 Maintain the current positive growth trend."
            )

        if not recommendations:
            recommendations.append(
                "✅ Continue monitoring business performance."
            )

        return (
            "💡 MY RECOMMENDATIONS\n\n"
            + "\n".join(recommendations)
        )

    # AI insights
    if any(
        word in question
        for word in [
            "insight",
            "insights",
            "overview"
        ]
    ):
        if insights:
            messages = []

            for insight in insights:
                if isinstance(insight, dict):
                    message = insight.get(
                        "message",
                        ""
                    )

                    if message:
                        messages.append(
                            f"• {message}"
                        )

            if messages:
                return (
                    "🤖 AI BUSINESS INSIGHTS\n\n"
                    + "\n".join(messages)
                )

        return (
            "No AI insights are currently available."
        )

    # Help
    if any(
        phrase in question
        for phrase in [
            "what can you do",
            "help",
            "what do you do"
        ]
    ):
        return (
            "🤖 I can help you analyze your business data.\n\n"
            "You can ask me about:\n"
            "💰 Revenue\n"
            "🏆 Best products\n"
            "📦 Units sold\n"
            "📈 Revenue growth\n"
            "🔍 Data quality\n"
            "⚠️ Anomalies\n"
            "💡 Recommendations\n"
            "📊 Complete business summary"
        )

    # Default response
    return (
        "🤖 I can help you understand this dataset.\n\n"
        "Try asking:\n"
        "• What is the total revenue?\n"
        "• What is the best product?\n"
        "• How is my business performing?\n"
        "• What should I improve?\n"
        "• Are there any anomalies?\n"
        "• How is the data quality?\n"
        "• Give me recommendations"
    )