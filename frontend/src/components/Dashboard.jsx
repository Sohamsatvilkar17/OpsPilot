import { useEffect, useState } from "react";


const API_URL = "https://opspilot-p1wk.onrender.com";


function Dashboard({ activeDatasetId }) {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (activeDatasetId) {
      loadDashboard();
    }
  }, [activeDatasetId]);


  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }


      /*
        Load business analytics
      */

      const analyticsResponse = await fetch(
        `${API_URL}/analytics/${activeDatasetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (analyticsResponse.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        throw new Error(
          "Session expired. Please login again."
        );
      }


      if (!analyticsResponse.ok) {
        throw new Error(
          "Unable to load business analytics."
        );
      }


      const analyticsData =
        await analyticsResponse.json();


      if (analyticsData.error) {
        throw new Error(
          analyticsData.error
        );
      }


      setData(analyticsData);


      /*
        Load anomaly information
      */

      const anomalyResponse = await fetch(
        `${API_URL}/analytics/${activeDatasetId}/anomalies`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (anomalyResponse.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        throw new Error(
          "Session expired. Please login again."
        );
      }


      if (anomalyResponse.ok) {
        const anomalyData =
          await anomalyResponse.json();

        if (!anomalyData.error) {
          setAnomalies(
            anomalyData.anomaly_detection
          );
        }
      }


      /*
        Load AI insights
      */

      const insightResponse = await fetch(
        `${API_URL}/analytics/${activeDatasetId}/insights`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (insightResponse.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        throw new Error(
          "Session expired. Please login again."
        );
      }


      if (insightResponse.ok) {
        const insightData =
          await insightResponse.json();

        if (!insightData.error) {
          setInsights(
            insightData.insights || []
          );
        }
      }

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };


  /*
    No dataset selected
  */

  if (!activeDatasetId) {
    return (
      <div className="page-container">

        <div className="page-header dashboard-header">
          <div>
            <div className="page-eyebrow">
              OPERATIONS OVERVIEW
            </div>

            <h1>
              Business Dashboard
            </h1>

            <p>
              Monitor business performance, data health,
              anomalies and AI-generated insights.
            </p>
          </div>
        </div>


        <div className="dashboard-empty">

          <div className="dashboard-empty-icon">
            📊
          </div>

          <h2>
            Select a dataset to get started
          </h2>

          <p>
            Choose a dataset from your workspace to
            view business performance and operational
            intelligence.
          </p>

          <div className="dashboard-empty-hint">
            Open <strong>Datasets</strong> from the
            sidebar and select a dataset.
          </div>

        </div>

      </div>
    );
  }


  /*
    Error state
  */

  if (error) {
    return (
      <div className="page-container">

        <div className="page-header dashboard-header">
          <div>
            <div className="page-eyebrow">
              OPERATIONS OVERVIEW
            </div>

            <h1>
              Business Dashboard
            </h1>
          </div>
        </div>


        <div className="dashboard-error">

          <div className="dashboard-error-icon">
            !
          </div>

          <div>
            <h3>
              Unable to load the dashboard
            </h3>

            <p>
              {error}
            </p>
          </div>

          <button
            className="primary-button"
            onClick={loadDashboard}
          >
            Try again
          </button>

        </div>

      </div>
    );
  }


  /*
    Loading state
  */

  if (loading || !data) {
    return (
      <div className="page-container">

        <div className="page-header dashboard-header">
          <div>
            <div className="page-eyebrow">
              OPERATIONS OVERVIEW
            </div>

            <h1>
              Business Dashboard
            </h1>

            <p>
              Preparing your business intelligence...
            </p>
          </div>
        </div>


        <div className="dashboard-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading business data
          </p>

        </div>

      </div>
    );
  }


  /*
    Business data
  */

  const metrics =
    data.business_metrics || {};

  const quality =
    data.data_quality || {};


  const totalRevenue =
    Number(metrics.total_revenue || 0);


  const totalUnits =
    Number(metrics.total_units_sold || 0);


  const averageOrderValue =
    Number(
      metrics.average_order_value || 0
    );


  const qualityScore =
    Number(
      quality.quality_score || 0
    );


  const anomalyCount =
    Number(
      anomalies?.anomaly_records || 0
    );


  const anomalyPercentage =
    Number(
      anomalies?.anomaly_percentage || 0
    );


  const totalRows =
    Number(
      quality.total_rows || data.rows || 0
    );


  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };


  const formatNumber = (value) => {
    return Number(value).toLocaleString("en-IN");
  };


  const qualityLabel =
    qualityScore >= 90
      ? "Excellent"
      : qualityScore >= 75
        ? "Good"
        : qualityScore >= 50
          ? "Needs attention"
          : "Poor";


  const anomalyLabel =
    anomalyCount === 0
      ? "No anomalies detected"
      : `${anomalyCount} record${anomalyCount === 1 ? "" : "s"} flagged`;


  return (
    <div className="page-container dashboard-page">


      {/* =========================================
          HEADER
          ========================================= */}

      <div className="page-header dashboard-header">

        <div>

          <div className="page-eyebrow">
            OPERATIONS OVERVIEW
          </div>

          <h1>
            Business Dashboard
          </h1>

          <p>
            A real-time view of your business
            performance and operational signals.
          </p>

        </div>


        <button
          className="dashboard-refresh"
          onClick={loadDashboard}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =========================================
          ACTIVE DATASET
          ========================================= */}

      <div className="active-dataset-banner">

        <div className="active-dataset-left">

          <div className="dataset-status-dot"></div>

          <div>

            <span className="banner-label">
              ACTIVE DATASET
            </span>

            <strong>
              {data.file_name || "Current dataset"}
            </strong>

          </div>

        </div>


        <div className="active-dataset-meta">

          <span>
            Dataset #{activeDatasetId}
          </span>

          <span>
            {totalRows.toLocaleString("en-IN")} records
          </span>

        </div>

      </div>


      {/* =========================================
          KPI CARDS
          ========================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>
              Business performance
            </h2>

            <p>
              Key metrics from the selected dataset
            </p>
          </div>

        </div>


        <div className="dashboard-kpi-grid">


          {/* Revenue */}

          <div className="dashboard-kpi">

            <div className="kpi-top">

              <span className="kpi-label">
                TOTAL REVENUE
              </span>

              <span className="kpi-icon revenue-icon">
                ₹
              </span>

            </div>

            <div className="kpi-value">
              {formatCurrency(totalRevenue)}
            </div>

            <div className="kpi-description">
              Revenue generated across all records
            </div>

          </div>


          {/* Units */}

          <div className="dashboard-kpi">

            <div className="kpi-top">

              <span className="kpi-label">
                UNITS SOLD
              </span>

              <span className="kpi-icon units-icon">
                #
              </span>

            </div>

            <div className="kpi-value">
              {formatNumber(totalUnits)}
            </div>

            <div className="kpi-description">
              Total quantity sold
            </div>

          </div>


          {/* Average Order Value */}

          <div className="dashboard-kpi">

            <div className="kpi-top">

              <span className="kpi-label">
                AVERAGE ORDER VALUE
              </span>

              <span className="kpi-icon order-icon">
                ↗
              </span>

            </div>

            <div className="kpi-value">
              {formatCurrency(averageOrderValue)}
            </div>

            <div className="kpi-description">
              Average revenue per order
            </div>

          </div>


          {/* Data Quality */}

          <div className="dashboard-kpi">

            <div className="kpi-top">

              <span className="kpi-label">
                DATA QUALITY
              </span>

              <span className="kpi-icon quality-icon">
                ✓
              </span>

            </div>

            <div className="kpi-value">
              {qualityScore}%
            </div>

            <div className="kpi-description">
              {qualityLabel}
            </div>

            <div className="quality-progress">

              <div
                className="quality-progress-fill"
                style={{
                  width: `${Math.min(
                    Math.max(qualityScore, 0),
                    100
                  )}%`,
                }}
              ></div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          BUSINESS SUMMARY
          ========================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <h2>
              Business summary
            </h2>

            <p>
              Operational indicators for the current dataset
            </p>
          </div>

        </div>


        <div className="dashboard-summary-grid">


          {/* Business overview */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <span className="panel-eyebrow">
                  PERFORMANCE
                </span>

                <h3>
                  Business overview
                </h3>

              </div>

              <span className="panel-icon">
                ◈
              </span>

            </div>


            <div className="summary-list">

              <div className="summary-row">

                <span>
                  Best-selling product
                </span>

                <strong>
                  {metrics.best_selling_product || "N/A"}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Average order value
                </span>

                <strong>
                  {formatCurrency(
                    averageOrderValue
                  )}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Total units sold
                </span>

                <strong>
                  {formatNumber(totalUnits)}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Records analysed
                </span>

                <strong>
                  {formatNumber(totalRows)}
                </strong>

              </div>

            </div>

          </div>


          {/* Data health */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <span className="panel-eyebrow">
                  DATA HEALTH
                </span>

                <h3>
                  Dataset quality
                </h3>

              </div>

              <span className="panel-icon">
                ✓
              </span>

            </div>


            <div className="health-score">

              <div className="health-score-number">
                {qualityScore}%
              </div>

              <div>

                <strong>
                  {qualityLabel}
                </strong>

                <span>
                  Overall data quality score
                </span>

              </div>

            </div>


            <div className="health-grid">

              <div>
                <span>
                  Missing values
                </span>

                <strong>
                  {quality.missing_values || 0}
                </strong>
              </div>


              <div>
                <span>
                  Duplicate rows
                </span>

                <strong>
                  {quality.duplicate_rows || 0}
                </strong>
              </div>


              <div>
                <span>
                  Invalid dates
                </span>

                <strong>
                  {quality.invalid_dates || 0}
                </strong>
              </div>


              <div>
                <span>
                  Anomalies
                </span>

                <strong>
                  {anomalyCount}
                </strong>
              </div>

            </div>

          </div>


          {/* Anomaly monitoring */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>

                <span className="panel-eyebrow">
                  MONITORING
                </span>

                <h3>
                  Anomaly detection
                </h3>

              </div>

              <span className="panel-icon warning-panel-icon">
                !
              </span>

            </div>


            <div className="anomaly-summary">

              <div className="anomaly-number">
                {anomalyCount}
              </div>

              <div>

                <strong>
                  {anomalyLabel}
                </strong>

                <span>
                  {anomalyPercentage}% of analysed records
                </span>

              </div>

            </div>


            <div className="anomaly-bar">

              <div
                className="anomaly-bar-fill"
                style={{
                  width: `${Math.min(
                    Math.max(anomalyPercentage, 0),
                    100
                  )}%`,
                }}
              ></div>

            </div>


            <p className="panel-note">
              Statistical outliers are highlighted for
              further investigation.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================
          AI INSIGHTS
          ========================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>
              AI business insights
            </h2>

            <p>
              Key observations generated from your business data
            </p>

          </div>

          <span className="ai-badge">
            AI POWERED
          </span>

        </div>


        {Array.isArray(insights) &&
        insights.length > 0 ? (

          <div className="dashboard-insights">

            {insights.slice(0, 4).map(
              (insight, index) => {

                const title =
                  typeof insight === "string"
                    ? "Business insight"
                    : insight.title ||
                      "Business insight";


                const message =
                  typeof insight === "string"
                    ? insight
                    : insight.message ||
                      "No description available.";


                return (
                  <div
                    className="dashboard-insight"
                    key={index}
                  >

                    <div className="insight-index">
                      {String(index + 1).padStart(2, "0")}
                    </div>


                    <div className="insight-main">

                      <h3>
                        {title}
                      </h3>

                      <p>
                        {message}
                      </p>

                    </div>


                    <span className="insight-arrow">
                      →
                    </span>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div className="dashboard-panel dashboard-no-insights">

            <div className="dashboard-no-insights-icon">
              ✦
            </div>

            <div>

              <h3>
                No insights available yet
              </h3>

              <p>
                AI-generated observations will appear
                here when insights are available.
              </p>

            </div>

          </div>

        )}

      </section>


    </div>
  );
}


export default Dashboard;