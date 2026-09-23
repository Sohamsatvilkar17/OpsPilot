import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";


const API_URL = "http://127.0.0.1:8000";


function Analytics({ activeDatasetId }) {

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (activeDatasetId) {
      loadAnalytics();
    }

  }, [activeDatasetId]);


  const loadAnalytics = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }


      const response = await fetch(
        `${API_URL}/analytics/${activeDatasetId}`,
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
          result.error ||
          result.detail ||
          "Failed to load analytics"
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

          <h1>📈 Analytics</h1>

          <p>
            Select a dataset to view business analytics.
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

          Loading analytics...

        </div>

      </div>

    );

  }


  if (error) {

    return (

      <div className="page-container">

        <div className="page-header">

          <h1>📈 Analytics</h1>

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


  const metrics = data.business_metrics;
  const quality = data.data_quality;


  const productChartData = Object.entries(
    metrics.revenue_by_product || {}
  ).map(([product, revenue]) => ({
    product,
    revenue
  }));


  const monthlyChartData = Object.entries(
    metrics.monthly_revenue || {}
  ).map(([month, revenue]) => ({
    month,
    revenue
  }));


  return (

    <div className="page-container">


      {/* Header */}

      <div className="page-header">

        <h1>📈 Business Analytics</h1>

        <p>
          Interactive analysis of your selected business dataset
        </p>

      </div>


      {/* Dataset Information */}

      <div className="analytics-section">

        <h2>📁 Active Dataset</h2>

        <div className="product-list">

          <div className="product-row">

            <span>
              File Name
            </span>

            <strong>
              {data.file_name}
            </strong>

          </div>


          <div className="product-row">

            <span>
              Dataset ID
            </span>

            <strong>
              #{activeDatasetId}
            </strong>

          </div>


          <div className="product-row">

            <span>
              Total Records
            </span>

            <strong>
              {quality.total_rows}
            </strong>

          </div>

        </div>

      </div>


      {/* KPI Cards */}

      <div className="analytics-results">


        <div className="metric-card">

          <span>💰</span>

          <h3>
            Total Revenue
          </h3>

          <p>
            ₹{metrics.total_revenue?.toLocaleString()}
          </p>

        </div>


        <div className="metric-card">

          <span>📦</span>

          <h3>
            Units Sold
          </h3>

          <p>
            {metrics.total_units_sold?.toLocaleString()}
          </p>

        </div>


        <div className="metric-card">

          <span>💵</span>

          <h3>
            Average Order Value
          </h3>

          <p>
            ₹{metrics.average_order_value?.toLocaleString()}
          </p>

        </div>


        <div className="metric-card">

          <span>🏆</span>

          <h3>
            Best Product
          </h3>

          <p>
            {metrics.best_selling_product || "N/A"}
          </p>

        </div>


      </div>


      {/* Monthly Revenue */}

      <div className="analytics-section">

        <h2>
          📊 Monthly Revenue Trend
        </h2>


        {monthlyChartData.length > 0 ? (

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <LineChart
                data={monthlyChartData}
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
                    `₹${Number(value).toLocaleString()}`
                  }
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        ) : (

          <p>
            No monthly revenue data available.
          </p>

        )}

      </div>


      {/* Product Revenue */}

      <div className="analytics-section">

        <h2>
          🏆 Revenue by Product
        </h2>


        {productChartData.length > 0 ? (

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart
                data={productChartData}
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
                  dataKey="product"
                />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString()}`
                  }
                />

                <Legend />

                <Bar
                  dataKey="revenue"
                  name="Revenue"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        ) : (

          <p>
            No product revenue data available.
          </p>

        )}

      </div>


      {/* Business Summary */}

      <div className="analytics-section">

        <h2>
          📋 Business Summary
        </h2>


        <div className="product-list">


          <div className="product-row">

            <span>
              💰 Total Revenue
            </span>

            <strong>
              ₹{metrics.total_revenue?.toLocaleString()}
            </strong>

          </div>


          <div className="product-row">

            <span>
              📦 Units Sold
            </span>

            <strong>
              {metrics.total_units_sold?.toLocaleString()}
            </strong>

          </div>


          <div className="product-row">

            <span>
              💵 Average Order Value
            </span>

            <strong>
              ₹{metrics.average_order_value?.toLocaleString()}
            </strong>

          </div>


          <div className="product-row">

            <span>
              🏆 Best Selling Product
            </span>

            <strong>
              {metrics.best_selling_product || "N/A"}
            </strong>

          </div>


        </div>

      </div>


      {/* Data Quality */}

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
              {quality.quality_score}%
            </strong>

          </div>


          <div className="product-row">

            <span>
              Missing Values
            </span>

            <strong>
              {quality.missing_values}
            </strong>

          </div>


          <div className="product-row">

            <span>
              Duplicate Rows
            </span>

            <strong>
              {quality.duplicate_rows}
            </strong>

          </div>


          <div className="product-row">

            <span>
              Invalid Dates
            </span>

            <strong>
              {quality.invalid_dates}
            </strong>

          </div>


        </div>

      </div>


    </div>

  );

}


export default Analytics;