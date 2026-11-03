import { useEffect, useState } from "react";

const API_URL = "https://opspilot-p1wk.onrender.com";

function Recommendations({ activeDatasetId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getIcon = (category) => {
    switch (category) {
      case "Marketing":
        return "🎯";
      case "Inventory":
        return "📦";
      case "Growth":
        return "📈";
      case "Risk":
        return "⚠️";
      case "Data Quality":
        return "🔍";
      case "Business":
        return "📊";
      default:
        return "💡";
    }
  };

  const getPriorityClass = (priority) => {
    if (!priority) return "";

    return priority.toLowerCase();
  };

  useEffect(() => {
    if (!activeDatasetId) {
      setLoading(false);
      return;
    }

    loadRecommendations();
  }, [activeDatasetId]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${API_URL}/recommendations/${activeDatasetId}`,
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
          data.error || "Failed to fetch recommendations"
        );
      }

      setRecommendations(data.recommendations || []);
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
              DECISION SUPPORT
            </div>

            <h1>Business Recommendations</h1>

            <p>
              Practical actions generated from your business
              performance and operational data.
            </p>
          </div>
        </div>

        <div className="empty-state">
          <div style={{ fontSize: "42px" }}>📁</div>

          <h2>No Dataset Selected</h2>

          <p>
            Select a dataset to generate business recommendations.
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
              DECISION SUPPORT
            </div>

            <h1>Business Recommendations</h1>

            <p>
              Evaluating your business data and identifying
              practical actions...
            </p>
          </div>
        </div>

        <div className="loading">
          <div style={{ fontSize: "30px", marginBottom: "10px" }}>
            🤖
          </div>

          Generating recommendations...
        </div>

      </div>
    );
  }

  const highPriorityCount = recommendations.filter(
    (item) =>
      item.priority?.toLowerCase() === "high" ||
      item.priority?.toLowerCase() === "critical"
  ).length;

  const riskCount = recommendations.filter(
    (item) =>
      item.category?.toLowerCase() === "risk"
  ).length;

  const growthCount = recommendations.filter(
    (item) =>
      item.category?.toLowerCase() === "growth"
  ).length;

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <div className="page-eyebrow">
            DECISION SUPPORT
          </div>

          <h1>Business Recommendations</h1>

          <p>
            AI-assisted actions derived from revenue,
            product performance, data quality, and anomaly signals.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadRecommendations}
        >
          ↻ Refresh Analysis
        </button>

      </div>


      {/* ENGINE STATUS */}
      <div className="recommendation-status">

        <div className="recommendation-status-main">

          <div className="recommendation-status-icon">
            ✦
          </div>

          <div>
            <div className="recommendation-status-label">
              OPSPILOT DECISION ENGINE
            </div>

            <h2>
              Recommendations are ready
            </h2>

            <p>
              The recommendation engine combines business metrics,
              data-quality checks, and machine-learning signals
              to identify practical next actions.
            </p>
          </div>

        </div>

        <div className="recommendation-status-badge">
          <span>●</span>
          Active
        </div>

      </div>


      {/* ERROR */}
      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}


      {/* SUMMARY */}
      {!error && recommendations.length > 0 && (
        <div className="recommendation-summary">

          <div className="recommendation-summary-card">
            <span className="summary-label">
              TOTAL
            </span>

            <strong>
              {recommendations.length}
            </strong>

            <p>Recommendations</p>
          </div>


          <div className="recommendation-summary-card">
            <span className="summary-label">
              PRIORITY
            </span>

            <strong>
              {highPriorityCount}
            </strong>

            <p>High priority</p>
          </div>


          <div className="recommendation-summary-card">
            <span className="summary-label">
              GROWTH
            </span>

            <strong>
              {growthCount}
            </strong>

            <p>Growth opportunities</p>
          </div>


          <div className="recommendation-summary-card">
            <span className="summary-label">
              RISK
            </span>

            <strong>
              {riskCount}
            </strong>

            <p>Risk-related actions</p>
          </div>

        </div>
      )}


      {/* EMPTY */}
      {!error && recommendations.length === 0 && (
        <div className="empty-state">

          <div style={{ fontSize: "42px" }}>
            ✓
          </div>

          <h2>
            No Recommendations Available
          </h2>

          <p>
            OpsPilot did not identify any additional actions
            for the selected dataset.
          </p>

        </div>
      )}


      {/* RECOMMENDATIONS */}
      {!error && recommendations.length > 0 && (
        <section className="recommendations-section">

          <div className="section-heading">

            <div>
              <div className="page-eyebrow">
                ACTION PLAN
              </div>

              <h2>
                Recommended Actions
              </h2>
            </div>

            <span className="section-count">
              {recommendations.length} items
            </span>

          </div>


          <div className="recommendations-grid">

            {recommendations.map(
              (recommendation, index) => (

                <div
                  className={`recommendation-card ${getPriorityClass(
                    recommendation.priority
                  )}`}
                  key={index}
                >

                  <div className="recommendation-card-top">

                    <div className="recommendation-icon">
                      {getIcon(
                        recommendation.category
                      )}
                    </div>

                    <div className="recommendation-meta">

                      <span className="recommendation-category">
                        {recommendation.category}
                      </span>

                      <span
                        className={`priority-badge ${getPriorityClass(
                          recommendation.priority
                        )}`}
                      >
                        {recommendation.priority}
                      </span>

                    </div>

                  </div>


                  <h3>
                    {recommendation.title}
                  </h3>


                  <p className="recommendation-message">
                    {recommendation.message}
                  </p>


                  <div className="recommendation-action">

                    <span>
                      →</span>

                    <div>
                      <strong>
                        Recommended action
                      </strong>

                      <p>
                        Review this signal and consider it
                        when planning your next business decision.
                      </p>
                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </section>
      )}


      {/* FOOTER INFORMATION */}
      <div className="recommendation-footer">

        <div className="recommendation-footer-icon">
          ✦
        </div>

        <div>

          <h3>
            How OpsPilot generates recommendations
          </h3>

          <p>
            OpsPilot evaluates revenue performance,
            product performance, growth trends, data quality,
            and machine-learning anomaly results to identify
            business actions from the selected dataset.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Recommendations;