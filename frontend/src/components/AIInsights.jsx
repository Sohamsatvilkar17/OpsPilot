import { useEffect, useState } from "react";

const API_URL = "https://opspilot-p1wk.onrender.com";

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
      <div className="ai-insights-page">
        <div className="ai-insights-empty">

          <div className="ai-insights-empty-icon">
            AI
          </div>

          <h2>No dataset selected</h2>

          <p>
            Select a dataset to generate business insights
            from your operational data.
          </p>

        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ai-insights-page">
        <div className="ai-insights-loading">

          <div className="ai-insights-spinner"></div>

          <h2>Analyzing business data</h2>

          <p>
            OpsPilot is generating insights from the selected
            dataset.
          </p>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-insights-page">

        <div className="ai-insights-header">
          <div>
            <span className="ai-insights-eyebrow">
              INTELLIGENCE
            </span>

            <h1>AI Business Insights</h1>

            <p>
              Data-driven observations and recommendations
              generated from your business dataset.
            </p>
          </div>
        </div>

        <div className="ai-insights-error">

          <div className="ai-insights-error-icon">
            !
          </div>

          <div>
            <h3>
              Unable to generate insights
            </h3>

            <p>{error}</p>

            <button
              onClick={loadInsights}
              className="ai-insights-retry-button"
            >
              Try again
            </button>
          </div>

        </div>

      </div>
    );
  }

  const insights = data?.insights || [];

  const positiveInsights =
    insights.filter(
      (insight) => insight.type === "positive"
    );

  const warningInsights =
    insights.filter(
      (insight) => insight.type === "warning"
    );

  const recommendationInsights =
    insights.filter(
      (insight) =>
        insight.type === "recommendation"
    );

  const getIcon = (type) => {
    if (type === "positive") {
      return "↗";
    }

    if (type === "warning") {
      return "!";
    }

    if (type === "recommendation") {
      return "→";
    }

    return "i";
  };

  const getTypeLabel = (type) => {
    if (type === "positive") {
      return "Positive signal";
    }

    if (type === "warning") {
      return "Attention";
    }

    if (type === "recommendation") {
      return "Recommendation";
    }

    return "Insight";
  };

  const getInsightClass = (type) => {
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
    <div className="ai-insights-page">

      {/* Header */}

      <div className="ai-insights-header">

        <div>
          <span className="ai-insights-eyebrow">
            INTELLIGENCE
          </span>

          <h1>AI Business Insights</h1>

          <p>
            Data-driven observations and recommendations
            generated from your selected business dataset.
          </p>
        </div>

        <div className="ai-insights-status">

          <span className="ai-insights-status-dot"></span>

          Analysis complete

        </div>

      </div>


      {/* Dataset Banner */}

      <div className="ai-insights-dataset-banner">

        <div>

          <span>ACTIVE DATASET</span>

          <strong>
            {data?.file_name}
          </strong>

        </div>

        <div className="ai-insights-dataset-id">
          Dataset #{activeDatasetId}
        </div>

      </div>


      {/* AI Summary */}

      <div className="ai-analysis-banner">

        <div className="ai-analysis-symbol">
          AI
        </div>

        <div>

          <span className="ai-analysis-label">
            OPSPILOT INTELLIGENCE
          </span>

          <h2>
            Business analysis completed
          </h2>

          <p>
            The selected dataset has been analyzed for
            revenue trends, product performance, data
            quality, anomalies, and business opportunities.
          </p>

        </div>

      </div>


      {/* Insight Summary */}

      <div className="ai-insight-summary-grid">

        <div className="ai-summary-card">

          <span>Total insights</span>

          <strong>
            {insights.length}
          </strong>

          <small>
            Generated observations
          </small>

        </div>


        <div className="ai-summary-card positive-summary">

          <span>Positive signals</span>

          <strong>
            {positiveInsights.length}
          </strong>

          <small>
            Favorable business indicators
          </small>

        </div>


        <div className="ai-summary-card warning-summary">

          <span>Attention areas</span>

          <strong>
            {warningInsights.length}
          </strong>

          <small>
            Items requiring review
          </small>

        </div>


        <div className="ai-summary-card recommendation-summary">

          <span>Recommendations</span>

          <strong>
            {recommendationInsights.length}
          </strong>

          <small>
            Suggested business actions
          </small>

        </div>

      </div>


      {/* Generated Insights */}

      <div className="ai-insights-section">

        <div className="ai-insights-section-header">

          <div>
            <span className="ai-section-label">
              GENERATED ANALYSIS
            </span>

            <h2>
              Business insights
            </h2>

            <p>
              Key observations identified from the selected
              dataset.
            </p>
          </div>

          <span className="ai-insight-count">
            {insights.length} insights
          </span>

        </div>


        {insights.length === 0 ? (
          <div className="ai-no-insights">

            <div className="ai-no-insights-icon">
              i
            </div>

            <h3>
              No insights available
            </h3>

            <p>
              Continue monitoring your business data as
              more information becomes available.
            </p>

          </div>
        ) : (
          <div className="ai-insights-grid">

            {insights.map(
              (insight, index) => (
                <div
                  className={getInsightClass(
                    insight.type
                  )}
                  key={index}
                >

                  <div className="ai-insight-icon">
                    {getIcon(insight.type)}
                  </div>

                  <div className="ai-insight-content">

                    <div className="ai-insight-header">

                      <div>
                        <span className="ai-insight-type">
                          {getTypeLabel(
                            insight.type
                          )}
                        </span>

                        <h3>
                          {insight.title}
                        </h3>
                      </div>

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


      {/* Recommendations */}

      <div className="ai-recommendations-card">

        <div className="ai-recommendations-header">

          <div>
            <span className="ai-section-label">
              ACTIONABLE INTELLIGENCE
            </span>

            <h2>
              Recommended actions
            </h2>

            <p>
              Business actions suggested from the generated
              insights.
            </p>
          </div>

          <div className="ai-recommendation-count">
            {recommendationInsights.length}
          </div>

        </div>


        <div className="ai-recommendations-list">

          {recommendationInsights.length === 0 ? (

            <div className="ai-no-recommendations">

              <span>i</span>

              <p>
                Continue monitoring business performance
                and data quality.
              </p>

            </div>

          ) : (

            recommendationInsights.map(
              (insight, index) => (
                <div
                  className="ai-recommendation-item"
                  key={index}
                >

                  <div className="ai-recommendation-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <strong>
                      {insight.title}
                    </strong>

                    <p>
                      {insight.message}
                    </p>
                  </div>

                </div>
              )
            )

          )}

        </div>

      </div>


      {/* Analysis Coverage */}

      <div className="ai-coverage-section">

        <div className="ai-insights-section-header">

          <div>
            <span className="ai-section-label">
              ANALYSIS COVERAGE
            </span>

            <h2>
              What OpsPilot analyzes
            </h2>

            <p>
              Core business dimensions used to generate
              operational insights.
            </p>
          </div>

        </div>


        <div className="ai-coverage-grid">

          <div className="ai-coverage-item">

            <div className="ai-coverage-icon">
              ↗
            </div>

            <div>
              <h3>Revenue trends</h3>

              <p>
                Identifies positive or negative changes in
                business revenue.
              </p>
            </div>

          </div>


          <div className="ai-coverage-item">

            <div className="ai-coverage-icon">
              ★
            </div>

            <div>
              <h3>Product performance</h3>

              <p>
                Identifies products contributing strongly to
                business performance.
              </p>
            </div>

          </div>


          <div className="ai-coverage-item">

            <div className="ai-coverage-icon">
              ✓
            </div>

            <div>
              <h3>Data quality</h3>

              <p>
                Reviews missing values, duplicates, and
                invalid data conditions.
              </p>
            </div>

          </div>


          <div className="ai-coverage-item">

            <div className="ai-coverage-icon">
              !
            </div>

            <div>
              <h3>Anomaly detection</h3>

              <p>
                Uses machine learning to identify unusual
                transactions.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIInsights;