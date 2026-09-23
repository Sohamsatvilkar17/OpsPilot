def generate_alerts(metrics, quality_report, anomaly_report):
    alerts = []

    revenue_growth = metrics.get("revenue_growth", 0)
    best_product = metrics.get("best_selling_product", "Unknown")

    quality_score = quality_report.get("quality_score", 0)

    anomaly_records = anomaly_report.get("anomaly_records", 0)
    anomaly_percentage = anomaly_report.get("anomaly_percentage", 0)

    # Revenue alert
    if revenue_growth < 0:
        alerts.append({
            "type": "revenue",
            "severity": "critical",
            "title": "Revenue Decline Detected",
            "message": (
                f"Revenue decreased by {abs(revenue_growth)}% "
                f"compared with the previous month."
            )
        })

    elif revenue_growth >= 20:
        alerts.append({
            "type": "revenue",
            "severity": "success",
            "title": "Strong Revenue Growth",
            "message": (
                f"Revenue increased by {revenue_growth}% "
                f"compared with the previous month."
            )
        })

    # Anomaly alert
    if anomaly_records > 0:
        alerts.append({
            "type": "anomaly",
            "severity": "critical",
            "title": "Unusual Transactions Detected",
            "message": (
                f"{anomaly_records} unusual transactions were detected "
                f"by the ML anomaly detection model "
                f"({anomaly_percentage}% of records)."
            )
        })

    # Data quality alert
    if quality_score < 70:
        alerts.append({
            "type": "data_quality",
            "severity": "critical",
            "title": "Poor Data Quality",
            "message": (
                f"Dataset quality score is {quality_score}%. "
                f"Data cleaning is recommended before making "
                f"business decisions."
            )
        })

    elif quality_score < 90:
        alerts.append({
            "type": "data_quality",
            "severity": "warning",
            "title": "Data Quality Needs Attention",
            "message": (
                f"Dataset quality score is {quality_score}%. "
                f"Some data-cleaning improvements are recommended."
            )
        })

    else:
        alerts.append({
            "type": "data_quality",
            "severity": "success",
            "title": "Data Quality Healthy",
            "message": (
                f"Dataset quality score is {quality_score}%. "
                f"No major data-quality problems were detected."
            )
        })

    # Product alert
    if best_product != "Unknown":
        alerts.append({
            "type": "product",
            "severity": "info",
            "title": "Top Product Performance",
            "message": (
                f"{best_product} is currently the highest "
                f"revenue-generating product."
            )
        })

    return alerts