import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";


function Dashboard({ activeDatasetId }) {

  const [data, setData] = useState(null);

  const [insights, setInsights] = useState([]);

  const [anomalies, setAnomalies] = useState(null);

  const [error, setError] = useState("");


  useEffect(() => {

    if (activeDatasetId) {
      loadDashboard();
    }

  }, [activeDatasetId]);


  const loadDashboard = async () => {

    try {

      setError("");
      setData(null);

      const token = localStorage.getItem("token");


      if (!token) {

        throw new Error(
          "Please login first."
        );

      }


      // =========================
      // LOAD ANALYTICS
      // =========================

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
          "Failed to load analytics"
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


      // =========================
      // LOAD ANOMALIES
      // =========================

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


      // =========================
      // LOAD AI INSIGHTS
      // =========================

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

    }

  };


  // =========================
  // NO DATASET SELECTED
  // =========================

  if (!activeDatasetId) {

    return (

      <div className="page-container">

        <div className="page-header">

          <h1>
            📊 Business Dashboard
          </h1>

          <p>
            Real-time AI-powered business intelligence
          </p>

        </div>


        <div className="empty-state">

          <h2>
            No Dataset Selected
          </h2>

          <p>
            Please select a dataset from the Datasets page.
          </p>

        </div>

      </div>

    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (

      <div className="page-container">

        <div className="page-header">

          <h1>
            📊 Business Dashboard
          </h1>

        </div>


        <div className="error">

          ❌ {error}

        </div>


        <button
          className="retry-button"
          onClick={loadDashboard}
        >

          🔄 Try Again

        </button>

      </div>

    );

  }


  // =========================
  // LOADING
  // =========================

  if (!data) {

    return (

      <div className="page-container">

        <div className="loading">

          ⏳ Loading dashboard...

        </div>

      </div>

    );

  }


  // =========================
  // DATA
  // =========================

  const metrics =
    data.business_metrics || {};

  const quality =
    data.data_quality || {};


  return (

    <div className="page-container">


      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <h1>
          📊 Business Dashboard
        </h1>

        <p>
          Real-time AI-powered business intelligence
        </p>

      </div>


      {/* =========================
          ACTIVE DATASET
      ========================= */}

      <div className="analytics-section">

        <h2>
          📁 Active Dataset: {data.file_name}
        </h2>

        <p>
          Dataset ID: {activeDatasetId}
        </p>

      </div>


      {/* =========================
          METRICS
      ========================= */}

      <div className="analytics-results">


        {/* TOTAL REVENUE */}

        <div className="metric-card">

          <span>
            💰
          </span>

          <h3>
            Total Revenue
          </h3>

          <p>

            ₹
            {metrics.total_revenue
              ? Number(
                  metrics.total_revenue
                ).toLocaleString("en-IN")
              : 0}

          </p>

        </div>


        {/* UNITS SOLD */}

        <div className="metric-card">

          <span>
            📦
          </span>

          <h3>
            Units Sold
          </h3>

          <p>
            {metrics.total_units_sold || 0}
          </p>

        </div>


        {/* DATA QUALITY */}

        <div className="metric-card">

          <span>
            🔍
          </span>

          <h3>
            Data Quality
          </h3>

          <p>
            {quality.quality_score || 0}%
          </p>

        </div>


        {/* ANOMALIES */}

        <div className="metric-card">

          <span>
            ⚠️
          </span>

          <h3>
            Anomalies
          </h3>

          <p>
            {anomalies?.anomaly_records || 0}
          </p>

        </div>


      </div>


      {/* =========================
          BUSINESS OVERVIEW
      ========================= */}

      <div className="analytics-section">

        <h2>
          📊 Business Overview
        </h2>


        <div className="product-list">


          <div className="product-row">

            <span>
              Average Order Value
            </span>

            <strong>

              ₹
              {metrics.average_order_value
                ? Number(
                    metrics.average_order_value
                  ).toLocaleString("en-IN")
                : 0}

            </strong>

          </div>


          <div className="product-row">

            <span>
              Best Selling Product
            </span>

            <strong>

              🏆{" "}
              {metrics.best_selling_product ||
                "N/A"}

            </strong>

          </div>


          <div className="product-row">

            <span>
              Total Records
            </span>

            <strong>
              {quality.total_rows || 0}
            </strong>

          </div>


          <div className="product-row">

            <span>
              Anomaly Rate
            </span>

            <strong>
              {anomalies?.anomaly_percentage || 0}%
            </strong>

          </div>


        </div>

      </div>


      {/* =========================
          DATA QUALITY
      ========================= */}

      <div className="analytics-section">

        <h2>
          🔍 Data Quality
        </h2>


        <div className="product-list">


          <div className="product-row">

            <span>
              Quality Score
            </span>

            <strong>
              {quality.quality_score || 0}%
            </strong>

          </div>


          <div className="product-row">

            <span>
              Missing Values
            </span>

            <strong>
              {quality.missing_values || 0}
            </strong>

          </div>


          <div className="product-row">

            <span>
              Duplicate Rows
            </span>

            <strong>
              {quality.duplicate_rows || 0}
            </strong>

          </div>


          <div className="product-row">

            <span>
              Invalid Dates
            </span>

            <strong>
              {quality.invalid_dates || 0}
            </strong>

          </div>


        </div>

      </div>


      {/* =========================
          AI INSIGHTS
      ========================= */}

      <div className="analytics-section">

        <h2>
          🤖 AI Business Insights
        </h2>


        {Array.isArray(insights) &&
        insights.length > 0 ? (

          insights.map(
            (insight, index) => (

              <div
                className="insight-card"
                key={index}
              >

                <div className="insight-number">

                  {index + 1}

                </div>


                <div className="insight-content">

                  <h3>

                    {typeof insight === "string"
                      ? "AI Insight"
                      : insight.title ||
                        "AI Insight"}

                  </h3>


                  <p>

                    {typeof insight === "string"
                      ? insight
                      : insight.message ||
                        "No description available."}

                  </p>

                </div>

              </div>

            )
          )

        ) : (

          <div className="empty-state">

            <p>
              🤖 No AI insights available yet.
            </p>

          </div>

        )}

      </div>


    </div>

  );

}


export default Dashboard;