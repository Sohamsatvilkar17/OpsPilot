import { useEffect, useState } from "react";

const API_URL = "https://opspilot-p1wk.onrender.com";

function Alerts({ activeDatasetId }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getIcon = (type) => {
    switch (type) {
      case "revenue":
        return "↗";

      case "anomaly":
        return "!";

      case "data_quality":
        return "⌕";

      case "product":
        return "★";

      default:
        return "•";
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case "critical":
        return "Critical";

      case "warning":
        return "Warning";

      case "success":
        return "Healthy";

      case "info":
        return "Information";

      default:
        return "Alert";
    }
  };

  const getTypeLabel = (type) => {
    if (!type) {
      return "General";
    }

    return type
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  useEffect(() => {
    if (!activeDatasetId) {
      setLoading(false);
      return;
    }

    loadAlerts();
  }, [activeDatasetId]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${API_URL}/alerts/${activeDatasetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        throw new Error(
          "Session expired. Please login again."
        );
      }

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Failed to fetch alerts"
        );
      }

      setAlerts(data.alerts || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!activeDatasetId) {
    return (
      <div className="page-container">

        <div className="page-header">

          <div>
            <div className="page-eyebrow">
              MONITORING
            </div>

            <h1>Alerts & Notifications</h1>

            <p>
              Monitor important business events,
              risks, and operational signals.
            </p>
          </div>

        </div>


        <div className="empty-state">

          <div style={{ fontSize: "42px" }}>
            📁
          </div>

          <h2>
            No Dataset Selected
          </h2>

          <p>
            Select a dataset to view its business alerts.
          </p>

        </div>

      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">

        <div className="page-header">

          <div>
            <div className="page-eyebrow">
              MONITORING
            </div>

            <h1>Alerts & Notifications</h1>

            <p>
              Checking the latest business signals...
            </p>
          </div>

        </div>

        <div className="loading">

          <div style={{ fontSize: "30px", marginBottom: "10px" }}>
            ◉
          </div>

          Loading business alerts...

        </div>

      </div>
    );
  }

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "critical"
  ).length;

  const warningCount = alerts.filter(
    (alert) => alert.severity === "warning"
  ).length;

  const healthyCount = alerts.filter(
    (alert) => alert.severity === "success"
  ).length;

  const infoCount = alerts.filter(
    (alert) => alert.severity === "info"
  ).length;

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <div className="page-eyebrow">
            MONITORING
          </div>

          <h1>Alerts & Notifications</h1>

          <p>
            Important business events, risks, and performance
            signals detected in your selected dataset.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadAlerts}
        >
          ↻ Refresh Alerts
        </button>

      </div>


      {/* STATUS */}
      <div className="alerts-monitor-status">

        <div className="alerts-monitor-main">

          <div className="alerts-monitor-icon">
            ◉
          </div>

          <div>

            <div className="recommendation-status-label">
              OPSPILOT MONITORING
            </div>

            <h2>
              Monitoring is active
            </h2>

            <p>
              Automated checks are evaluating revenue,
              anomalies, data quality, and product performance.
            </p>

          </div>

        </div>

        <div className="monitor-active-badge">
          <span>●</span>
          Monitoring
        </div>

      </div>


      {/* ERROR */}
      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}


      {/* SUMMARY */}
      <div className="alerts-summary">

        <div className="alert-summary-card total">

          <div className="alert-summary-icon">
            🔔
          </div>

          <div>
            <span>Total</span>

            <strong>
              {alerts.length}
            </strong>

            <p>
              Alerts detected
            </p>
          </div>

        </div>


        <div className="alert-summary-card critical">

          <div className="alert-summary-icon">
            !
          </div>

          <div>
            <span>Critical</span>

            <strong>
              {criticalCount}
            </strong>

            <p>
              Immediate attention
            </p>
          </div>

        </div>


        <div className="alert-summary-card warning">

          <div className="alert-summary-icon">
            ⚠
          </div>

          <div>
            <span>Warnings</span>

            <strong>
              {warningCount}
            </strong>

            <p>
              Requires review
            </p>
          </div>

        </div>


        <div className="alert-summary-card healthy">

          <div className="alert-summary-icon">
            ✓
          </div>

          <div>
            <span>Healthy</span>

            <strong>
              {healthyCount}
            </strong>

            <p>
              Positive signals
            </p>
          </div>

        </div>

      </div>


      {/* ALERT LIST */}
      <section className="alerts-section">

        <div className="section-heading">

          <div>

            <div className="page-eyebrow">
              DETECTED SIGNALS
            </div>

            <h2>
              Business Alerts
            </h2>

          </div>

          <span className="section-count">
            {alerts.length} alerts
          </span>

        </div>


        {alerts.length === 0 ? (

          <div className="empty-state">

            <div style={{ fontSize: "42px" }}>
              ✓
            </div>

            <h2>
              No Active Alerts
            </h2>

            <p>
              No significant business alerts were detected
              for the selected dataset.
            </p>

          </div>

        ) : (

          <div className="alerts-container">

            {alerts.map((alert, index) => (

              <div
                className={`alert-card ${alert.severity}`}
                key={index}
              >

                <div className="alert-icon">

                  {getIcon(alert.type)}

                </div>


                <div className="alert-content">

                  <div className="alert-header">

                    <div>

                      <div className="alert-type">
                        {getTypeLabel(alert.type)}
                      </div>

                      <h3>
                        {alert.title}
                      </h3>

                    </div>


                    <span className="alert-severity">
                      {getSeverityLabel(
                        alert.severity
                      )}
                    </span>

                  </div>


                  <p>
                    {alert.message}
                  </p>


                  {alert.severity === "critical" && (

                    <div className="alert-action">

                      <span>
                        ⚡
                      </span>

                      <div>

                        <strong>
                          Action Required
                        </strong>

                        <p>
                          Review this issue before
                          making important business decisions.
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* INFO */}
      <div className="alerts-info">

        <div className="alerts-info-icon">
          ✦
        </div>

        <div>

          <h3>
            Automated Monitoring
          </h3>

          <p>
            OpsPilot analyzes revenue trends, machine-learning
            anomalies, data quality, and product performance
            to surface important business events automatically.
          </p>

        </div>

        <div className="alerts-info-count">

          <strong>
            {infoCount}
          </strong>

          <span>
            info signals
          </span>

        </div>

      </div>

    </div>
  );
}

export default Alerts;