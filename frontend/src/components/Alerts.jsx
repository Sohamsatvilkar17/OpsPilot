import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";


function Alerts({ activeDatasetId }) {

  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  const getIcon = (type) => {

    switch (type) {

      case "revenue":
        return "📈";

      case "anomaly":
        return "⚠️";

      case "data_quality":
        return "🔍";

      case "product":
        return "🏆";

      default:
        return "🔔";

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

          <h1>🚨 Alerts & Notifications</h1>

          <p>
            Monitor important business events and risks
          </p>

        </div>


        <div className="empty-state">

          <div style={{ fontSize: "50px" }}>
            📁
          </div>

          <h2>
            No Dataset Selected
          </h2>

          <p>
            Please select a dataset to view business alerts.
          </p>

        </div>

      </div>

    );

  }


  if (loading) {

    return (

      <div className="loading">

        Loading business alerts...

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


  return (

    <div className="page-container">

      <div className="page-header">

        <h1>🚨 Alerts & Notifications</h1>

        <p>
          Monitor important business events, risks, and performance signals
        </p>

      </div>


      <div className="alerts-summary">

        <div className="alert-summary-card total">

          <span>🔔</span>

          <div>

            <strong>
              {alerts.length}
            </strong>

            <p>
              Total Alerts
            </p>

          </div>

        </div>


        <div className="alert-summary-card critical">

          <span>🔴</span>

          <div>

            <strong>
              {criticalCount}
            </strong>

            <p>
              Critical
            </p>

          </div>

        </div>


        <div className="alert-summary-card warning">

          <span>🟠</span>

          <div>

            <strong>
              {warningCount}
            </strong>

            <p>
              Warnings
            </p>

          </div>

        </div>


        <div className="alert-summary-card healthy">

          <span>🟢</span>

          <div>

            <strong>
              {healthyCount}
            </strong>

            <p>
              Healthy
            </p>

          </div>

        </div>

      </div>


      {error && (

        <div className="error">

          ❌ {error}

        </div>

      )}


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

                  <h3>
                    {alert.title}
                  </h3>

                  <span className="alert-type">

                    {alert.type.replace("_", " ")}

                  </span>

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

                  <span>⚡</span>

                  <strong>
                    Action Required
                  </strong>

                  <span>
                    Review this issue before making important decisions.
                  </span>

                </div>

              )}

            </div>

          </div>

        ))}

      </div>


      <div className="alerts-info">

        <div className="alerts-info-icon">
          🤖
        </div>


        <div>

          <h3>
            Automated Monitoring
          </h3>

          <p>
            OpsPilot continuously analyzes revenue trends,
            machine-learning anomalies, data quality, and
            product performance to identify important business events.
          </p>

        </div>

      </div>

    </div>

  );

}


export default Alerts;