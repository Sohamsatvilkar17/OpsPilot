import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";


function AIInsights({ activeDatasetId }) {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    if (activeDatasetId) {
      loadInsights();
    } else {
      setLoading(false);
    }

  }, [activeDatasetId]);


  const loadInsights = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }


      const response = await fetch(
        `${API_URL}/analytics/${activeDatasetId}/insights`,
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


      const result = await response.json();


      if (!response.ok || result.error) {

        throw new Error(
          result.error || "Failed to load AI insights"
        );

      }


      setData(result);

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

          <h1>💡 AI Business Insights</h1>

          <p>
            Intelligent recommendations generated from
            your business data.
          </p>

        </div>


        <div className="empty-state">

          📁 Please select a dataset first.

        </div>

      </div>

    );

  }


  if (loading) {

    return (

      <div className="page-container">

        <div className="loading">

          🤖 Analyzing your business data...

        </div>

      </div>

    );

  }


  if (error) {

    return (

      <div className="page-container">

        <div className="page-header">

          <h1>💡 AI Business Insights</h1>

        </div>


        <div className="error">

          ❌ {error}

        </div>

      </div>

    );

  }


  const insights = data?.insights || [];


  const getIcon = (type) => {

    if (type === "positive") {
      return "📈";
    }

    if (type === "warning") {
      return "⚠️";
    }

    if (type === "recommendation") {
      return "🎯";
    }

    return "💡";

  };


  const getClassName = (type) => {

    if (type === "positive") {
      return "ai-insight-card positive";
    }

    if (type === "warning") {
      return "ai-insight-card warning";
    }

    if (type === "recommendation") {
      return "ai-insight-card recommendation";
    }

    return "ai-insight-card info";

  };


  return (

    <div className="page-container">

      <div className="page-header">

        <h1>💡 AI Business Insights</h1>

        <p>
          AI-powered analysis and recommendations based
          on your selected business dataset.
        </p>

      </div>


      <div className="analytics-section">

        <h2>📁 Active Dataset</h2>

        <div className="product-list">

          <div className="product-row">

            <span>Dataset</span>

            <strong>
              {data?.file_name}
            </strong>

          </div>


          <div className="product-row">

            <span>Dataset ID</span>

            <strong>
              #{activeDatasetId}
            </strong>

          </div>


          <div className="product-row">

            <span>AI Analysis</span>

            <strong>
              Completed
            </strong>

          </div>

        </div>

      </div>


      <div className="ai-status-card">

        <div className="ai-status-icon">
          🤖
        </div>

        <div>

          <h2>
            OpsPilot AI Analysis
          </h2>

          <p>
            Your dataset has been analyzed for revenue
            trends, product performance, data quality,
            anomalies, and business opportunities.
          </p>

        </div>

      </div>


      <div className="analytics-section">

        <h2>🧠 Generated Insights</h2>

        {insights.length === 0 ? (

          <div className="empty-state">

            No insights are currently available.

          </div>

        ) : (

          <div className="ai-insights-grid">

            {insights.map(
              (insight, index) => (

                <div
                  className={getClassName(
                    insight.type
                  )}
                  key={index}
                >

                  <div className="ai-insight-icon">

                    {getIcon(insight.type)}

                  </div>


                  <div className="ai-insight-content">

                    <div className="ai-insight-header">

                      <h3>
                        {insight.title}
                      </h3>

                      <span>
                        {insight.type}
                      </span>

                    </div>


                    <p>
                      {insight.message}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      <div className="analytics-section">

        <h2>🎯 Recommended Actions</h2>

        <div className="recommendation-panel">

          {insights
            .filter(
              (insight) =>
                insight.type ===
                "recommendation"
            )
            .map(
              (insight, index) => (

                <div
                  className="recommendation-item"
                  key={index}
                >

                  <span>
                    🎯
                  </span>

                  <p>
                    {insight.message}
                  </p>

                </div>

              )
            )}


          {insights.filter(
            (insight) =>
              insight.type ===
              "recommendation"
          ).length === 0 && (

            <p>
              Continue monitoring your business
              performance and data quality.
            </p>

          )}

        </div>

      </div>


      <div className="analytics-section">

        <h2>🔍 What OpsPilot Analyzes</h2>

        <div className="ai-analysis-grid">

          <div className="ai-analysis-item">

            <span>📈</span>

            <h3>
              Revenue Trends
            </h3>

            <p>
              Identifies positive or negative changes
              in business revenue.
            </p>

          </div>


          <div className="ai-analysis-item">

            <span>🏆</span>

            <h3>
              Product Performance
            </h3>

            <p>
              Identifies the highest-performing
              products.
            </p>

          </div>


          <div className="ai-analysis-item">

            <span>🔍</span>

            <h3>
              Data Quality
            </h3>

            <p>
              Detects missing values, duplicates,
              and invalid dates.
            </p>

          </div>


          <div className="ai-analysis-item">

            <span>⚠️</span>

            <h3>
              Anomaly Detection
            </h3>

            <p>
              Uses machine learning to identify
              unusual transactions.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}


export default AIInsights;