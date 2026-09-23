import { useEffect, useState } from "react";


const API_URL = "http://127.0.0.1:8000";


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
          data.error ||
          "Failed to fetch recommendations"
        );

      }


      setRecommendations(
        data.recommendations || []
      );

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

          <h1>💡 Business Recommendations</h1>

          <p>
            AI-powered recommendations based on your business data
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
            Please select a dataset to generate business recommendations.
          </p>

        </div>

      </div>

    );

  }


  if (loading) {

    return (

      <div className="loading">

        Generating business recommendations...

      </div>

    );

  }


  return (

    <div className="page-container">

      <div className="page-header">

        <h1>💡 Business Recommendations</h1>

        <p>
          AI-powered actions generated from your business data
        </p>

      </div>


      <div className="recommendation-status">

        <div className="recommendation-status-icon">
          🤖
        </div>


        <div>

          <h2>
            OpsPilot Recommendation Engine
          </h2>

          <p>
            Recommendations are generated using business analytics,
            data quality analysis, and ML anomaly detection.
          </p>

        </div>


        <div className="recommendation-status-badge">
          ● Active
        </div>

      </div>


      {error && (

        <div className="error">

          ❌ {error}

        </div>

      )}


      {!error &&
        recommendations.length === 0 && (

          <div className="empty-state">

            <h2>
              No Recommendations
            </h2>

            <p>
              No recommendations were generated for this dataset.
            </p>

          </div>

        )}


      {!error &&
        recommendations.length > 0 && (

          <div className="recommendations-grid">

            {recommendations.map(
              (recommendation, index) => (

                <div
                  className={`recommendation-card ${
                    recommendation.priority?.toLowerCase() || ""
                  }`}
                  key={index}
                >

                  <div className="recommendation-card-top">

                    <div className="recommendation-icon">

                      {getIcon(
                        recommendation.category
                      )}

                    </div>


                    <div className="recommendation-category">

                      {recommendation.category}

                    </div>


                    <span className="priority-badge">

                      {recommendation.priority}

                    </span>

                  </div>


                  <h3>
                    {recommendation.title}
                  </h3>


                  <p>
                    {recommendation.message}
                  </p>


                  <div className="recommendation-action">

                    <span>
                      💡
                    </span>

                    <strong>
                      Recommended Action
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        )}


      <div className="recommendation-footer">

        <div>

          <span>
            📌
          </span>

          <strong>
            How OpsPilot generates recommendations
          </strong>

        </div>


        <p>
          OpsPilot analyzes revenue performance,
          product performance, growth trends,
          data quality, and machine-learning anomaly
          detection results to identify practical business actions.
        </p>

      </div>

    </div>

  );

}


export default Recommendations;