from backend.app.ai.llm_service import ask_ollama


def generate_business_analysis(
    question,
    metrics,
    quality_report,
    anomaly_report,
    insights
):
    question_lower = question.lower().strip()

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

    revenue_growth = metrics.get(
        "revenue_growth",
        0
    )

    best_product = metrics.get(
        "best_selling_product",
        "Unknown"
    )

    monthly_revenue = metrics.get(
        "monthly_revenue",
        {}
    )

    product_growth = metrics.get(
        "product_growth",
        {}
    )

    growth_contributors = metrics.get(
        "growth_contributors",
        []
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

    # --------------------------------------------------
    # FAST RESPONSES
    # These do not use Ollama.
    # --------------------------------------------------

    if (
        "total revenue" in question_lower
        or question_lower in [
            "revenue",
            "sales",
            "total sales",
            "total earnings"
        ]
    ):
        return (
            f"💰 The total revenue for this dataset is "
            f"₹{total_revenue:,.0f}."
        )

    if (
        "best product" in question_lower
        or "best selling product" in question_lower
        or "top product" in question_lower
    ):
        return (
            f"🏆 The best-selling product is "
            f"{best_product}."
        )

    if (
        "units sold" in question_lower
        or "how many units" in question_lower
        or "total units" in question_lower
    ):
        return (
            f"📦 A total of {total_units:,} "
            f"units were sold."
        )

    if (
        "average order value" in question_lower
        or "average order" in question_lower
        or "aov" in question_lower
    ):
        return (
            f"💵 The average order value is "
            f"₹{average_order_value:,.0f}."
        )

    if (
        "revenue growth" in question_lower
        or "sales growth" in question_lower
    ):
        if revenue_growth > 0:
            return (
                f"📈 Revenue growth is "
                f"{revenue_growth}% compared with "
                f"the previous month."
            )

        if revenue_growth < 0:
            return (
                f"📉 Revenue decreased by "
                f"{abs(revenue_growth)}% compared with "
                f"the previous month."
            )

        return (
            "📊 Revenue growth is currently 0%."
        )

    if (
        "data quality" in question_lower
        or "quality score" in question_lower
    ):
        return (
            "🔍 DATA QUALITY\n\n"
            f"Quality Score: {quality_score}%\n"
            f"Missing Values: {missing_values}\n"
            f"Duplicate Rows: {duplicate_rows}\n"
            f"Invalid Dates: {invalid_dates}"
        )

    if (
        "anomalies" in question_lower
        or "anomaly" in question_lower
        or "unusual records" in question_lower
    ):
        if anomaly_records > 0:
            return (
                f"⚠️ I detected {anomaly_records} "
                f"unusual records.\n\n"
                f"Anomaly Rate: {anomaly_percentage}%\n\n"
                "These are statistical outliers detected "
                "by the ML model and should be reviewed "
                "to determine their business meaning."
            )

        return (
            "✅ No unusual records were detected "
            "by the anomaly detection model."
        )

    # --------------------------------------------------
    # FAST RECOMMENDATIONS
    # --------------------------------------------------

    if (
        "give me recommendations" in question_lower
        or "give recommendations" in question_lower
        or question_lower == "recommendations"
        or question_lower == "recommendation"
        or "recommend some actions" in question_lower
        or "what do you recommend" in question_lower
        or "give me advice" in question_lower
    ):
        recommendations = []

        if best_product != "Unknown":
            recommendations.append(
                f"🎯 Focus marketing and inventory planning "
                f"on {best_product}, your best-selling product."
            )

        if revenue_growth > 0:
            recommendations.append(
                f"📈 Continue monitoring the positive revenue "
                f"growth of {revenue_growth}%."
            )
        elif revenue_growth < 0:
            recommendations.append(
                f"📉 Investigate the revenue decline of "
                f"{abs(revenue_growth)}%."
            )

        if quality_score < 90:
            recommendations.append(
                f"🔍 Improve data quality. The current "
                f"quality score is {quality_score}%."
            )

        if anomaly_records > 0:
            recommendations.append(
                f"⚠️ Review the {anomaly_records} statistical "
                f"anomalies detected by the ML model."
            )

        if not recommendations:
            recommendations.append(
                "✅ Continue monitoring revenue, products, "
                "data quality, and anomalies."
            )

        return (
            "💡 BUSINESS RECOMMENDATIONS\n\n"
            + "\n".join(
                f"{index}. {recommendation}"
                for index, recommendation
                in enumerate(recommendations[:3], 1)
            )
        )
    # --------------------------------------------------
    # PRODUCT DRIVING GROWTH
    # --------------------------------------------------

    if (
        "driving growth" in question_lower
        or "drove growth" in question_lower
        or "driving revenue growth" in question_lower
        or "contributed to growth" in question_lower
    ):
        if growth_contributors:
            top_product = max(
                growth_contributors,
                key=lambda item: item.get(
                    "revenue_change",
                    0
                )
            )

            product_name = top_product.get(
                "product",
                "Unknown"
            )

            revenue_change = top_product.get(
                "revenue_change",
                0
            )

            growth_percentage = top_product.get(
                "growth_percentage",
                0
            )

            return (
                f"📈 {product_name} had the largest "
                f"positive revenue contribution to the "
                f"latest monthly increase.\n\n"
                f"Revenue change: "
                f"₹{revenue_change:,.0f}\n"
                f"Product growth: {growth_percentage}%\n\n"
                "This shows contribution to the increase; "
                "it does not by itself establish the cause."
            )

        return (
            "The available dataset does not contain "
            "enough information to determine which "
            "product drove growth."
        )

    # --------------------------------------------------
    # GREETING
    # --------------------------------------------------

    if question_lower in [
        "hi",
        "hello",
        "hey",
        "hello there"
    ]:
        return (
            "Hello! 👋 I am your OpsPilot AI Assistant.\n\n"
            "I can analyze your revenue, products, "
            "growth, data quality, anomalies, and "
            "business performance."
        )

    # --------------------------------------------------
    # HELP
    # --------------------------------------------------

    if (
        "what can you do" in question_lower
        or question_lower == "help"
        or "what do you do" in question_lower
    ):
        return (
            "🤖 I can help analyze your business dataset.\n\n"
            "You can ask me about:\n"
            "💰 Revenue\n"
            "🏆 Best products\n"
            "📦 Units sold\n"
            "📈 Revenue growth\n"
            "🔍 Data quality\n"
            "⚠️ Anomalies\n"
            "📊 Business performance\n"
            "💡 Recommendations"
        )

    # --------------------------------------------------
    # BUILD AI CONTEXT
    # Complex questions reach Ollama.
    # --------------------------------------------------

    monthly_lines = []

    for month, revenue in monthly_revenue.items():
        monthly_lines.append(
            f"{month}: ₹{revenue:,.2f}"
        )

    monthly_context = "\n".join(
        monthly_lines
    )

    product_growth_lines = []

    for product, data in product_growth.items():
        product_growth_lines.append(
            f"{product}: "
            f"previous month "
            f"₹{data['previous_month_revenue']:,.2f}, "
            f"current month "
            f"₹{data['current_month_revenue']:,.2f}, "
            f"change "
            f"₹{data['revenue_change']:,.2f}, "
            f"growth "
            f"{data['growth_percentage']}%"
        )

    product_growth_context = "\n".join(
        product_growth_lines
    )

    total_revenue_increase = 0

    if len(monthly_revenue) >= 2:
        revenue_values = list(
            monthly_revenue.values()
        )

        previous_revenue = revenue_values[-2]
        current_revenue = revenue_values[-1]

        total_revenue_increase = (
            current_revenue -
            previous_revenue
        )

    contributor_lines = []

    for item in growth_contributors:
        contribution_share = 0

        if total_revenue_increase > 0:
            contribution_share = (
                item["revenue_change"]
                / total_revenue_increase
            ) * 100

        contributor_lines.append(
            f"{item['product']}: "
            f"+₹{item['revenue_change']:,.2f} "
            f"({item['growth_percentage']}% growth), "
            f"approximately "
            f"{contribution_share:.2f}% "
            f"of the total monthly revenue increase"
        )

    contributor_context = "\n".join(
        contributor_lines
    )

    prompt = f"""
You are OpsPilot AI, a professional Business
Intelligence Analyst.

Analyze the user's question using ONLY the
verified business evidence provided below.

================ VERIFIED BUSINESS DATA ================

Total Revenue:
₹{total_revenue:,.2f}

Total Units Sold:
{total_units}

Average Order Value:
₹{average_order_value:,.2f}

Overall Revenue Growth:
{revenue_growth}%

Best Selling Product:
{best_product}

Monthly Revenue:
{monthly_context}

Total Increase From Previous Month:
₹{total_revenue_increase:,.2f}

Product Month-over-Month Performance:
{product_growth_context}

Growth Contributors:
{contributor_context}

Data Quality Score:
{quality_score}%

Missing Values:
{missing_values}

Duplicate Rows:
{duplicate_rows}

Invalid Dates:
{invalid_dates}

ML Anomaly Records:
{anomaly_records}

ML Anomaly Percentage:
{anomaly_percentage}%

Business Insights:
{insights}

=========================================================

USER QUESTION:

{question}

================ RESPONSE RULES ========================

1. Answer the user's question directly.

2. Use only the verified business data.

3. Use actual numbers when relevant.

4. Distinguish overall revenue growth,
monthly revenue change, product growth,
and revenue contribution.

5. Do not assume that the best-selling product
caused revenue growth.

6. Do not claim causation unless the data proves it.

7. Anomalies are statistical outliers.
Do not automatically describe them as fraud
or errors.

8. If information is unavailable, say:
"The available dataset does not contain enough
information to determine that."

9. Give practical evidence-based recommendations.

10. For complex questions use exactly:

Summary

Evidence

Top 3 Actions

11. Keep the answer concise and professional.

12. Do not mention Python, FastAPI, Ollama,
prompts, or internal implementation details.

13. Do not repeat the entire dataset.

=========================================================

Now provide the best possible data-grounded
business analysis.
"""

    return ask_ollama(prompt)