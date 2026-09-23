def generate_recommendations(metrics, quality_report, anomaly_report):
    recommendations = []

    total_revenue = metrics.get("total_revenue", 0)
    best_product = metrics.get("best_selling_product", "Unknown")
    revenue_growth = metrics.get("revenue_growth", 0)

    quality_score = quality_report.get("quality_score", 0)

    anomaly_records = anomaly_report.get("anomaly_records", 0)
    anomaly_percentage = anomaly_report.get("anomaly_percentage", 0)

    # Marketing recommendation
    if best_product != "Unknown":
        recommendations.append({
            "category": "Marketing",
            "priority": "High",
            "title": f"Promote {best_product}",
            "message": (
                f"{best_product} is the highest revenue-generating product. "
                f"Consider increasing its marketing visibility and promotions."
            )
        })

    # Inventory recommendation
    if best_product != "Unknown":
        recommendations.append({
            "category": "Inventory",
            "priority": "High",
            "title": f"Maintain {best_product} Inventory",
            "message": (
                f"Strong performance from {best_product} suggests maintaining "
                f"sufficient inventory to avoid stock shortages."
            )
        })

    # Growth recommendation
    if revenue_growth > 0:
        recommendations.append({
            "category": "Growth",
            "priority": "Medium",
            "title": "Continue Growth Strategy",
            "message": (
                f"Revenue increased by {revenue_growth}% compared with the "
                f"previous month. Continue monitoring this positive trend."
            )
        })
    elif revenue_growth < 0:
        recommendations.append({
            "category": "Growth",
            "priority": "High",
            "title": "Review Revenue Decline",
            "message": (
                f"Revenue decreased by {abs(revenue_growth)}%. "
                f"Review product demand, pricing, and recent sales activity."
            )
        })

    # Anomaly recommendation
    if anomaly_records > 0:
        recommendations.append({
            "category": "Risk",
            "priority": "High",
            "title": "Investigate Unusual Transactions",
            "message": (
                f"{anomaly_records} unusual transactions were detected by the "
                f"ML model ({anomaly_percentage}% of records). "
                f"Review these transactions for possible business or data issues."
            )
        })

    # Data quality recommendation
    if quality_score >= 90:
        recommendations.append({
            "category": "Data Quality",
            "priority": "Low",
            "title": "Maintain Data Quality",
            "message": (
                f"Data quality is excellent at {quality_score}%. "
                f"Continue following the current data management practices."
            )
        })
    else:
        recommendations.append({
            "category": "Data Quality",
            "priority": "High",
            "title": "Improve Data Quality",
            "message": (
                f"Data quality is currently {quality_score}%. "
                f"Clean and validate the dataset before making important decisions."
            )
        })

    # General business recommendation
    recommendations.append({
        "category": "Business",
        "priority": "Medium",
        "title": "Monitor Business Performance",
        "message": (
            f"Current total revenue is ₹{total_revenue:,.0f}. "
            f"Continue monitoring revenue, products, anomalies, and data quality "
            f"regularly."
        )
    })

    return recommendations
