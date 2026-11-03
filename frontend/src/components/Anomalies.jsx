import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Anomalies({ activeDatasetId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeDatasetId) {
      setLoading(false);
      return;
    }

    loadAnomalies();
  }, [activeDatasetId]);

  const loadAnomalies = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${API_URL}/analytics/${activeDatasetId}/anomalies`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        throw new Error(
          "Session expired. Please login again."
        );
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.detail ||
            `Server returned status ${response.status}`
        );
      }

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.anomaly_detection) {
        throw new Error(
          "Anomaly detection data was not returned by the server."
        );
      }

      setData(result.anomaly_detection);
    } catch (error) {
      console.error("Anomaly detection error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!activeDatasetId) {
    return (
      <div className="anomalies-page">
        <div className="anomalies-empty">
          <div className="anomalies-empty-icon">
            !
          </div>

          <h2>No dataset selected</h2>

          <p>
            Select a dataset to run machine-learning anomaly
            detection.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="anomalies-page">
        <div className="anomalies-loading">
          <div className="anomalies-spinner"></div>

          <h2>Analyzing transactions</h2>

          <p>
            OpsPilot is running Isolation Forest anomaly
            detection on the selected dataset.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="anomalies-page">
        <div className="anomalies-header">
          <div>
            <span className="anomalies-eyebrow">
              MACHINE LEARNING
            </span>

            <h1>Anomaly Detection</h1>

            <p>
              Identify unusual transactions that may require
              further review.
            </p>
          </div>
        </div>

        <div className="anomalies-error">
          <div className="anomalies-error-icon">
            !
          </div>

          <div>
            <h3>Unable to analyze dataset</h3>

            <p>{error}</p>

            <button
              onClick={loadAnomalies}
              className="anomalies-retry-button"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const anomalies = data?.anomalies || [];

  const anomalyCount =
    data?.anomaly_records || 0;

  const anomalyPercentage =
    data?.anomaly_percentage || 0;

  const totalRecords =
    data?.total_records ||
    data?.records ||
    0;

  return (
    <div className="anomalies-page">

      {/* Header */}

      <div className="anomalies-header">

        <div>
          <span className="anomalies-eyebrow">
            MACHINE LEARNING
          </span>

          <h1>Anomaly Detection</h1>

          <p>
            Identify unusual business transactions using
            machine-learning based analysis.
          </p>
        </div>

        <div className="anomalies-model-badge">
          <span className="anomalies-model-dot"></span>
          Isolation Forest
        </div>

      </div>


      {/* Dataset Banner */}

      <div className="anomalies-dataset-banner">

        <div>
          <span>ACTIVE DATASET</span>

          <strong>
            Dataset #{activeDatasetId}
          </strong>
        </div>

        <div className="anomalies-dataset-status">
          Analysis complete
        </div>

      </div>


      {/* KPI Cards */}

      <div className="anomalies-kpi-grid">

        <div className="anomalies-kpi-card">

          <div className="anomalies-kpi-top">
            <span>Anomalies detected</span>

            <div className="anomalies-kpi-icon">
              !
            </div>
          </div>

          <strong>
            {anomalyCount}
          </strong>

          <small>
            Unusual records identified
          </small>

        </div>


        <div className="anomalies-kpi-card">

          <div className="anomalies-kpi-top">
            <span>Anomaly rate</span>

            <div className="anomalies-kpi-icon">
              %
            </div>
          </div>

          <strong>
            {anomalyPercentage}%
          </strong>

          <small>
            Share of analyzed records
          </small>

        </div>


        <div className="anomalies-kpi-card">

          <div className="anomalies-kpi-top">
            <span>Detection model</span>

            <div className="anomalies-kpi-icon">
              ML
            </div>
          </div>

          <strong className="anomalies-kpi-text">
            Isolation Forest
          </strong>

          <small>
            Unsupervised anomaly detection
          </small>

        </div>


        <div className="anomalies-kpi-card">

          <div className="anomalies-kpi-top">
            <span>Dataset</span>

            <div className="anomalies-kpi-icon">
              ID
            </div>
          </div>

          <strong>
            #{activeDatasetId}
          </strong>

          <small>
            {totalRecords
              ? `${totalRecords} records analyzed`
              : "Selected business dataset"}
          </small>

        </div>

      </div>


      {/* Detection Status */}

      {anomalyCount > 0 ? (
        <div className="anomalies-status-card warning">

          <div className="anomalies-status-icon">
            !
          </div>

          <div>
            <span className="anomalies-status-label">
              REVIEW RECOMMENDED
            </span>

            <h2>
              Unusual transactions detected
            </h2>

            <p>
              The machine-learning model identified{" "}
              <strong>{anomalyCount}</strong>{" "}
              unusual transaction
              {anomalyCount === 1 ? "" : "s"}.
              Review these records to determine whether
              they represent data issues, unusual customer
              activity, or genuine business events.
            </p>
          </div>

        </div>
      ) : (
        <div className="anomalies-status-card success">

          <div className="anomalies-status-icon">
            ✓
          </div>

          <div>
            <span className="anomalies-status-label">
              ANALYSIS COMPLETE
            </span>

            <h2>
              No significant anomalies detected
            </h2>

            <p>
              The machine-learning model did not identify
              unusual transactions in the selected dataset.
            </p>
          </div>

        </div>
      )}


      {/* Detected Transactions */}

      <div className="anomalies-table-card">

        <div className="anomalies-card-header">

          <div>
            <span className="anomalies-section-label">
              DETECTED RECORDS
            </span>

            <h2>
              Transactions requiring attention
            </h2>

            <p>
              Records identified as statistically unusual
              by the anomaly detection model.
            </p>
          </div>

          <div className="anomalies-count-badge">
            {anomalies.length} records
          </div>

        </div>


        {anomalies.length === 0 ? (
          <div className="anomalies-no-records">
            <div className="anomalies-check-icon">
              ✓
            </div>

            <h3>
              No anomalous transactions
            </h3>

            <p>
              There are currently no records requiring
              anomaly review.
            </p>
          </div>
        ) : (
          <div className="anomalies-table-wrapper">

            <table className="anomalies-table">

              <thead>
                <tr>
                  <th>Row</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>

                {anomalies.map(
                  (anomaly, index) => (
                    <tr key={index}>

                      <td>
                        <span className="anomaly-row-number">
                          {anomaly.row_number}
                        </span>
                      </td>

                      <td>
                        {anomaly.date || "-"}
                      </td>

                      <td>
                        <strong>
                          {anomaly.product || "-"}
                        </strong>
                      </td>

                      <td>
                        {anomaly.quantity ?? "-"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          anomaly.price || 0
                        ).toLocaleString()}
                      </td>

                      <td>
                        <strong className="anomaly-revenue">
                          ₹
                          {Number(
                            anomaly.revenue || 0
                          ).toLocaleString()}
                        </strong>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>


      {/* Methodology */}

      <div className="anomalies-method-card">

        <div className="anomalies-card-header">

          <div>
            <span className="anomalies-section-label">
              DETECTION METHOD
            </span>

            <h2>
              How anomaly detection works
            </h2>

            <p>
              OpsPilot evaluates transaction-level patterns
              to identify observations that differ from the
              overall dataset.
            </p>
          </div>

        </div>


        <div className="anomalies-method-grid">

          <div>
            <span>Algorithm</span>
            <strong>Isolation Forest</strong>
          </div>

          <div>
            <span>Input features</span>
            <strong>Quantity, Price, Revenue</strong>
          </div>

          <div>
            <span>Detected records</span>
            <strong>{anomalyCount}</strong>
          </div>

          <div>
            <span>Anomaly rate</span>
            <strong>{anomalyPercentage}%</strong>
          </div>

          <div>
            <span>Purpose</span>
            <strong>Detect unusual transactions</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Anomalies;