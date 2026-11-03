import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const API_URL = "https://opspilot-p1wk.onrender.com";

function Forecast({ activeDatasetId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeDatasetId) {
      loadForecast();
    } else {
      setLoading(false);
    }
  }, [activeDatasetId]);

  const loadForecast = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${API_URL}/forecast/${activeDatasetId}`,
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
          result.error || "Failed to load forecast"
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
      <div className="forecast-page">
        <div className="forecast-empty">
          <div className="forecast-empty-icon">↗</div>

          <h2>No dataset selected</h2>

          <p>
            Select a dataset from the Datasets page to generate
            a revenue forecast.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="forecast-page">
        <div className="forecast-loading">
          <div className="forecast-spinner"></div>

          <h2>Generating forecast</h2>

          <p>
            OpsPilot is analyzing historical revenue data.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forecast-page">
        <div className="forecast-header">
          <div>
            <span className="forecast-eyebrow">
              PREDICTIVE ANALYTICS
            </span>

            <h1>Revenue Forecast</h1>

            <p>
              Project future revenue using historical business
              performance.
            </p>
          </div>
        </div>

        <div className="forecast-error">
          <div className="forecast-error-icon">!</div>

          <div>
            <h3>Unable to generate forecast</h3>

            <p>{error}</p>

            <button
              onClick={loadForecast}
              className="forecast-retry-button"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const historical =
    data.forecast?.historical || [];

  const future =
    data.forecast?.forecast || [];

  const chartData = [
    ...historical.map((item) => ({
      month: item.month,
      historical: item.revenue,
      forecast: null
    })),

    ...future.map((item) => ({
      month: item.month,
      historical: null,
      forecast: item.predicted_revenue
    }))
  ];

  const lastHistorical =
    historical.length > 0
      ? historical[historical.length - 1].revenue
      : 0;

  const firstPrediction =
    future.length > 0
      ? future[0].predicted_revenue
      : 0;

  const forecastChange =
    lastHistorical > 0
      ? (
          ((firstPrediction - lastHistorical) /
            lastHistorical) *
          100
        ).toFixed(2)
      : 0;

  const modelName =
    data.forecast?.model || "Linear Regression";

  const totalForecast =
    future.reduce(
      (total, item) =>
        total + Number(item.predicted_revenue || 0),
      0
    );

  return (
    <div className="forecast-page">

      {/* Header */}

      <div className="forecast-header">
        <div>
          <span className="forecast-eyebrow">
            PREDICTIVE ANALYTICS
          </span>

          <h1>Revenue Forecast</h1>

          <p>
            Use historical business performance to estimate
            upcoming revenue trends.
          </p>
        </div>

        <div className="forecast-status">
          <span className="forecast-status-dot"></span>
          Forecast ready
        </div>
      </div>


      {/* Dataset Banner */}

      <div className="forecast-dataset-banner">
        <div className="forecast-dataset-main">
          <div className="forecast-file-icon">
            CSV
          </div>

          <div>
            <span>ACTIVE DATASET</span>

            <strong>
              {data.file_name}
            </strong>
          </div>
        </div>

        <div className="forecast-dataset-id">
          Dataset #{activeDatasetId}
        </div>
      </div>


      {/* KPI Cards */}

      <div className="forecast-kpi-grid">

        <div className="forecast-kpi-card">
          <div className="forecast-kpi-top">
            <span>Latest revenue</span>
            <div className="forecast-kpi-icon">₹</div>
          </div>

          <strong>
            ₹{Number(lastHistorical).toLocaleString()}
          </strong>

          <small>
            Most recent historical period
          </small>
        </div>


        <div className="forecast-kpi-card forecast-kpi-highlight">
          <div className="forecast-kpi-top">
            <span>Next month</span>
            <div className="forecast-kpi-icon">↗</div>
          </div>

          <strong>
            ₹{Number(firstPrediction).toLocaleString()}
          </strong>

          <small>
            Predicted revenue
          </small>
        </div>


        <div className="forecast-kpi-card">
          <div className="forecast-kpi-top">
            <span>Expected change</span>
            <div className="forecast-kpi-icon">%</div>
          </div>

          <strong className={
            Number(forecastChange) >= 0
              ? "forecast-positive"
              : "forecast-negative"
          }>
            {Number(forecastChange) >= 0 ? "+" : ""}
            {forecastChange}%
          </strong>

          <small>
            Compared with latest revenue
          </small>
        </div>


        <div className="forecast-kpi-card">
          <div className="forecast-kpi-top">
            <span>Forecast horizon</span>
            <div className="forecast-kpi-icon">3M</div>
          </div>

          <strong>
            {future.length} months
          </strong>

          <small>
            Future revenue estimates
          </small>
        </div>

      </div>


      {/* Forecast Chart */}

      <div className="forecast-chart-card">

        <div className="forecast-card-header">
          <div>
            <span className="forecast-section-label">
              REVENUE OUTLOOK
            </span>

            <h2>Historical vs predicted revenue</h2>

            <p>
              Historical performance and model-generated
              revenue estimates.
            </p>
          </div>

          <div className="forecast-model-badge">
            <span>MODEL</span>
            {modelName}
          </div>
        </div>


        <div className="forecast-chart-wrapper">

          <ResponsiveContainer
            width="100%"
            height={390}
          >
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 10
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(148, 163, 184, 0.12)"
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#94a3b8",
                  fontSize: 12
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#94a3b8",
                  fontSize: 12
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  `₹${(value / 1000).toFixed(0)}K`
                }
              />

              <Tooltip
                contentStyle={{
                  background: "#171b23",
                  border: "1px solid #2a3140",
                  borderRadius: "10px",
                  color: "#ffffff"
                }}
                formatter={(value) =>
                  value !== null
                    ? `₹${Number(
                        value
                      ).toLocaleString()}`
                    : ""
                }
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="historical"
                name="Historical Revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{
                  r: 4,
                  strokeWidth: 2
                }}
                connectNulls={false}
              />

              <Line
                type="monotone"
                dataKey="forecast"
                name="Predicted Revenue"
                stroke="#22c55e"
                strokeWidth={3}
                strokeDasharray="7 6"
                dot={{
                  r: 4,
                  strokeWidth: 2
                }}
                connectNulls={false}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>


      {/* Forecast Details */}

      <div className="forecast-details-grid">

        {/* Future Predictions */}

        <div className="forecast-table-card">

          <div className="forecast-card-header">
            <div>
              <span className="forecast-section-label">
                UPCOMING PERIODS
              </span>

              <h2>Future revenue predictions</h2>
            </div>

            <span className="forecast-count-badge">
              {future.length} periods
            </span>
          </div>


          <div className="forecast-table-wrapper">

            <table className="forecast-table">

              <thead>
                <tr>
                  <th>Period</th>
                  <th>Predicted revenue</th>
                </tr>
              </thead>

              <tbody>

                {future.map(
                  (item, index) => (
                    <tr key={index}>

                      <td>
                        <strong>
                          {item.month}
                        </strong>
                      </td>

                      <td>
                        ₹
                        {Number(
                          item.predicted_revenue
                        ).toLocaleString()}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* Forecast Summary */}

        <div className="forecast-summary-card">

          <span className="forecast-section-label">
            MODEL SUMMARY
          </span>

          <h2>Forecast configuration</h2>

          <div className="forecast-summary-list">

            <div>
              <span>Algorithm</span>
              <strong>{modelName}</strong>
            </div>

            <div>
              <span>Historical periods</span>
              <strong>
                {historical.length}
              </strong>
            </div>

            <div>
              <span>Future periods</span>
              <strong>
                {future.length}
              </strong>
            </div>

            <div>
              <span>Total forecast</span>
              <strong>
                ₹{totalForecast.toLocaleString()}
              </strong>
            </div>

          </div>

          <div className="forecast-note">
            <strong>Planning note</strong>

            <p>
              Forecast values are estimates generated from
              historical revenue patterns. They can support
              planning and should be reviewed alongside
              current business conditions.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Forecast;