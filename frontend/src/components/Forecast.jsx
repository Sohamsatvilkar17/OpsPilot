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


const API_URL = "http://127.0.0.1:8000";


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

      <div className="page-container">

        <div className="page-header">

          <h1>🔮 Revenue Forecast</h1>

          <p>
            Predict future business revenue using machine learning.
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

          🤖 Generating revenue forecast...

        </div>

      </div>

    );

  }


  if (error) {

    return (

      <div className="page-container">

        <div className="page-header">

          <h1>🔮 Revenue Forecast</h1>

        </div>


        <div className="error">

          ❌ {error}

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


  return (

    <div className="page-container">


      <div className="page-header">

        <h1>🔮 Revenue Forecast</h1>

        <p>
          Predictive business analytics using machine learning
        </p>

      </div>


      {/* Dataset Information */}

      <div className="analytics-section">

        <h2>📁 Forecast Information</h2>


        <div className="product-list">

          <div className="product-row">

            <span>Dataset</span>

            <strong>
              {data.file_name}
            </strong>

          </div>


          <div className="product-row">

            <span>Dataset ID</span>

            <strong>
              #{activeDatasetId}
            </strong>

          </div>


          <div className="product-row">

            <span>Forecast Model</span>

            <strong>
              {data.forecast?.model}
            </strong>

          </div>


          <div className="product-row">

            <span>Forecast Period</span>

            <strong>
              Next 3 Months
            </strong>

          </div>

        </div>

      </div>


      {/* Forecast KPI Cards */}

      <div className="analytics-results">

        <div className="metric-card">

          <span>📊</span>

          <h3>Last Revenue</h3>

          <p>
            ₹{Number(lastHistorical).toLocaleString()}
          </p>

        </div>


        <div className="metric-card">

          <span>🔮</span>

          <h3>Next Month Forecast</h3>

          <p>
            ₹{Number(firstPrediction).toLocaleString()}
          </p>

        </div>


        <div className="metric-card">

          <span>📈</span>

          <h3>Expected Change</h3>

          <p>
            {forecastChange}%
          </p>

        </div>


        <div className="metric-card">

          <span>🤖</span>

          <h3>Model</h3>

          <p>
            Linear Regression
          </p>

        </div>

      </div>


      {/* Forecast Chart */}

      <div className="analytics-section">

        <h2>📈 Revenue Forecast Trend</h2>

        <p>
          Historical revenue is shown alongside the
          predicted revenue for the next three months.
        </p>


        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={400}
          >

            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />


              <XAxis
                dataKey="month"
              />


              <YAxis />


              <Tooltip
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
                strokeWidth={3}
                dot={{ r: 5 }}
                connectNulls={false}
              />


              <Line
                type="monotone"
                dataKey="forecast"
                name="Predicted Revenue"
                strokeWidth={3}
                strokeDasharray="6 6"
                dot={{ r: 5 }}
                connectNulls={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* Forecast Table */}

      <div className="analytics-section">

        <h2>🔮 Future Revenue Predictions</h2>


        <div className="table-container">

          <table className="anomaly-table">

            <thead>

              <tr>

                <th>Month</th>

                <th>Predicted Revenue</th>

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


      {/* Explanation */}

      <div className="analytics-section">

        <h2>🧠 About This Forecast</h2>


        <div className="product-list">

          <div className="product-row">

            <span>Algorithm</span>

            <strong>
              Linear Regression
            </strong>

          </div>


          <div className="product-row">

            <span>Historical Data</span>

            <strong>
              {historical.length} Months
            </strong>

          </div>


          <div className="product-row">

            <span>Future Predictions</span>

            <strong>
              {future.length} Months
            </strong>

          </div>


          <div className="product-row">

            <span>Purpose</span>

            <strong>
              Revenue Planning
            </strong>

          </div>

        </div>

      </div>

    </div>

  );

}


export default Forecast;