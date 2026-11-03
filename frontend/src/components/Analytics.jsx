import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";


const API_URL = "https://opspilot-p1wk.onrender.com";


function Analytics({ activeDatasetId }) {

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /*
   * Convert monthly revenue into the format
   * required by Recharts.
   *
   * Supports both:
   *
   * {
   *   "2022-01": 10000
   * }
   *
   * and:
   *
   * [
   *   {
   *     month: "2022-01",
   *     revenue: 10000
   *   }
   * ]
   */

  const convertMonthlyRevenue = (value) => {

    if (!value) {
      return [];
    }


    if (Array.isArray(value)) {

      return value
        .map((item) => {

          if (!item) {
            return null;
          }

          return {
            month:
              item.month ||
              item.period ||
              item.date ||
              "",

            revenue: Number(
              item.revenue ??
              item.value ??
              0
            ),
          };

        })
        .filter(
          (item) =>
            item &&
            item.month
        );

    }


    if (
      typeof value === "object"
    ) {

      return Object.entries(
        value
      ).map(
        ([month, revenue]) => ({
          month,
          revenue: Number(
            revenue || 0
          ),
        })
      );

    }


    return [];
  };


  /*
   * Convert product revenue.
   */

  const convertProductRevenue = (
    value
  ) => {

    if (!value) {
      return [];
    }


    if (Array.isArray(value)) {

      return value
        .map((item) => {

          if (!item) {
            return null;
          }

          return {
            product:
              item.product ||
              item.name ||
              item.item ||
              "",

            revenue: Number(
              item.revenue ??
              item.value ??
              0
            ),
          };

        })
        .filter(
          (item) =>
            item &&
            item.product
        );

    }


    if (
      typeof value === "object"
    ) {

      return Object.entries(
        value
      ).map(
        ([product, revenue]) => ({
          product,
          revenue: Number(
            revenue || 0
          ),
        })
      );

    }


    return [];
  };


  /*
   * Load analytics.
   */

  const loadAnalytics = async () => {

    try {

      setLoading(true);

      setError("");


      if (!activeDatasetId) {

        setAnalytics(null);

        setLoading(false);

        return;

      }


      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        throw new Error(
          "Please login again."
        );

      }


      const response =
        await fetch(
          `${API_URL}/analytics/${activeDatasetId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const result =
        await response.json();


      console.log(
        "OpsPilot Analytics:",
        result
      );


      if (!response.ok) {

        throw new Error(
          result.detail ||
          result.error ||
          "Unable to load analytics."
        );

      }


      if (result.error) {

        throw new Error(
          result.error
        );

      }


      /*
       * The backend normally returns:
       *
       * {
       *   dataset_id,
       *   file_name,
       *   business_metrics,
       *   data_quality,
       *   ...
       * }
       */

      const metrics =
        result.business_metrics ||
        result.metrics ||
        {};


      /*
       * Monthly revenue.
       */

      const monthlyRevenue =
        convertMonthlyRevenue(
          metrics.monthly_revenue
        );


      /*
       * Product revenue.
       *
       * Current backend provides
       * top_products, so use it as
       * a fallback.
       */

      let productRevenue =
        convertProductRevenue(
          metrics.revenue_by_product
        );


      if (
        productRevenue.length === 0
      ) {

        productRevenue =
          convertProductRevenue(
            metrics.top_products
          );

      }


      /*
       * Sort products by revenue.
       */

      productRevenue =
        productRevenue
          .sort(
            (a, b) =>
              b.revenue -
              a.revenue
          )
          .slice(0, 10);


      /*
       * Store normalized frontend data.
       */

      setAnalytics({

        ...result,

        business_metrics: {

          ...metrics,

          monthly_revenue:
            monthlyRevenue,

          revenue_by_product:
            productRevenue,

        },

      });


    } catch (err) {

      console.error(
        "Analytics loading error:",
        err
      );


      setError(
        err.message ||
        "Unable to load analytics."
      );


    } finally {

      setLoading(false);

    }

  };


  /*
   * Load whenever dataset changes.
   */

  useEffect(() => {

    loadAnalytics();

  }, [activeDatasetId]);


  /*
   * Loading screen.
   */

  if (loading) {

    return (

      <div className="analytics-page">

        <div className="analytics-loading">

          <div className="analytics-empty-icon">
            ◌
          </div>

          <p>
            Loading business analytics...
          </p>

        </div>

      </div>

    );

  }


  /*
   * Error screen.
   */

  if (error) {

    return (

      <div className="analytics-page">

        <div className="analytics-error">

          <div className="analytics-error-icon">
            !
          </div>

          <div>

            <h3>
              Analytics unavailable
            </h3>

            <p>
              {error}
            </p>

          </div>

        </div>

      </div>

    );

  }


  /*
   * No dataset.
   */

  if (!activeDatasetId) {

    return (

      <div className="analytics-page">

        <div className="analytics-empty">

          <div className="analytics-empty-icon">
            ◫
          </div>

          <h2>
            No dataset selected
          </h2>

          <p>
            Select a dataset to view
            business performance,
            revenue trends and product
            analytics.
          </p>

        </div>

      </div>

    );

  }


  if (!analytics) {
    return null;
  }


  const metrics =
    analytics.business_metrics ||
    {};


  const dataQuality =
    analytics.data_quality ||
    {};


  /*
   * Dataset information.
   */

  const fileName =
    analytics.file_name ||
    "Selected dataset";


  const rows =
    analytics.rows ||
    analytics.dataset?.rows ||
    0;


  /*
   * Business metrics.
   */

  const totalRevenue =
    Number(
      metrics.total_revenue || 0
    );


  const totalUnits =
    Number(
      metrics.total_units_sold || 0
    );


  const averageOrderValue =
    Number(
      metrics.average_order_value || 0
    );


  const bestProduct =
    metrics.best_selling_product ||
    "Not available";


  const revenueGrowth =
    Number(
      metrics.revenue_growth || 0
    );


  const profitMargin =
    Number(
      metrics.profit_margin || 0
    );


  const estimatedProfit =
    Number(
      metrics.estimated_profit || 0
    );


  /*
   * Chart data.
   */

  const monthlyRevenue =
    metrics.monthly_revenue || [];


  const productRevenue =
    metrics.revenue_by_product || [];


  /*
   * Quality.
   */

  const qualityScore =
    Number(
      dataQuality.quality_score || 0
    );


  const missingValues =
    Number(
      dataQuality.missing_values || 0
    );


  const duplicateRows =
    Number(
      dataQuality.duplicate_rows || 0
    );


  const invalidDates =
    Number(
      dataQuality.invalid_dates || 0
    );


  /*
   * Format currency.
   */

  const formatCurrency = (
    value
  ) => {

    return `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;

  };


  /*
   * Format number.
   */

  const formatNumber = (
    value
  ) => {

    return Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    );

  };


  /*
   * Month label.
   *
   * 2022-01
   * →
   * Jan 2022
   */

  const formatMonth = (
    value
  ) => {

    if (!value) {
      return "";
    }


    const parts =
      String(value).split("-");


    if (
      parts.length === 2
    ) {

      const year =
        parts[0];

      const month =
        Number(parts[1]);


      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];


      if (
        month >= 1 &&
        month <= 12
      ) {

        return `${months[month - 1]} ${year}`;

      }

    }


    return String(value);

  };


  return (

    <div className="analytics-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="analytics-header">

        <div>

          <span className="eyebrow">
            BUSINESS INTELLIGENCE
          </span>

          <h1>
            Analytics
          </h1>

          <p>
            Performance analysis and
            operational metrics for your
            selected dataset.
          </p>

        </div>


        <button
          className="analytics-refresh-button"
          onClick={loadAnalytics}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =====================================================
          DATASET BANNER
          ===================================================== */}

      <div className="analytics-dataset-banner">

        <div className="analytics-dataset-left">

          <div className="analytics-dataset-icon">
            CSV
          </div>

          <div>

            <span>
              ACTIVE DATASET
            </span>

            <strong>
              {fileName}
            </strong>

          </div>

        </div>


        <div className="analytics-dataset-meta">

          <div>

            <span>
              DATASET
            </span>

            <strong>
              #{activeDatasetId}
            </strong>

          </div>


          <div>

            <span>
              RECORDS
            </span>

            <strong>
              {formatNumber(rows)}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          BUSINESS OVERVIEW
          ===================================================== */}

      <section className="analytics-section">

        <div className="analytics-section-heading">

          <div>

            <span>
              PERFORMANCE SNAPSHOT
            </span>

            <h2>
              Business overview
            </h2>

          </div>

        </div>


        <div className="analytics-kpi-grid">


          {/* Revenue */}

          <div className="analytics-kpi">

            <div className="analytics-kpi-top">

              <span>
                TOTAL REVENUE
              </span>

              <div className="analytics-kpi-icon">
                ₹
              </div>

            </div>

            <strong>
              {formatCurrency(
                totalRevenue
              )}
            </strong>

            <p>
              Revenue generated across
              all records
            </p>

          </div>


          {/* Units */}

          <div className="analytics-kpi">

            <div className="analytics-kpi-top">

              <span>
                UNITS SOLD
              </span>

              <div className="analytics-kpi-icon">
                #
              </div>

            </div>

            <strong>
              {formatNumber(
                totalUnits
              )}
            </strong>

            <p>
              Total quantity recorded
              across transactions
            </p>

          </div>


          {/* AOV */}

          <div className="analytics-kpi">

            <div className="analytics-kpi-top">

              <span>
                AVERAGE ORDER VALUE
              </span>

              <div className="analytics-kpi-icon">
                ↗
              </div>

            </div>

            <strong>
              {formatCurrency(
                averageOrderValue
              )}
            </strong>

            <p>
              Average revenue represented
              by each business record
            </p>

          </div>


          {/* Top product */}

          <div className="analytics-kpi">

            <div className="analytics-kpi-top">

              <span>
                TOP PRODUCT
              </span>

              <div className="analytics-kpi-icon">
                ★
              </div>

            </div>

            <strong className="analytics-kpi-product">
              {bestProduct}
            </strong>

            <p>
              Highest-performing product
              by recorded revenue
            </p>

          </div>


        </div>

      </section>


      {/* =====================================================
          MONTHLY REVENUE
          ===================================================== */}

      <section className="analytics-section">

        <div className="analytics-section-heading">

          <div>

            <span>
              REVENUE PERFORMANCE
            </span>

            <h2>
              Monthly revenue trend
            </h2>

          </div>


          <span className="analytics-chart-badge">
            {monthlyRevenue.length} periods
          </span>

        </div>


        <div className="analytics-chart-card">

          {monthlyRevenue.length === 0 ? (

            <div className="analytics-no-data">

              No monthly revenue data
              available.

            </div>

          ) : (

            <div
              style={{
                width: "100%",
                height: "330px",
              }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={monthlyRevenue}
                  margin={{
                    top: 15,
                    right: 20,
                    left: 10,
                    bottom: 15,
                  }}
                >

                  <CartesianGrid
                    stroke="#242a32"
                    strokeDasharray="3 3"
                    vertical={false}
                  />


                  <XAxis
                    dataKey="month"
                    tickFormatter={
                      formatMonth
                    }
                    stroke="#606976"
                    tick={{
                      fill: "#727b88",
                      fontSize: 10,
                    }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={25}
                  />


                  <YAxis
                    stroke="#606976"
                    tick={{
                      fill: "#727b88",
                      fontSize: 10,
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={82}
                    tickFormatter={(value) =>
                      formatCurrency(
                        value
                      )
                    }
                  />


                  <Tooltip
                    contentStyle={{
                      background:
                        "#151920",
                      border:
                        "1px solid #303640",
                      borderRadius:
                        "8px",
                      color:
                        "#e4e7eb",
                    }}
                    labelStyle={{
                      color:
                        "#8f98a6",
                      marginBottom:
                        "5px",
                    }}
                    itemStyle={{
                      color:
                        "#9ca7ff",
                    }}
                    formatter={(value) => [
                      formatCurrency(
                        value
                      ),
                      "Revenue",
                    ]}
                    labelFormatter={
                      formatMonth
                    }
                  />


                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7c8cff"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                      stroke: "#7c8cff",
                      fill: "#111419",
                    }}
                    connectNulls
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          PRODUCT REVENUE
          ===================================================== */}

      <section className="analytics-section">

        <div className="analytics-section-heading">

          <div>

            <span>
              PRODUCT PERFORMANCE
            </span>

            <h2>
              Revenue by product
            </h2>

          </div>


          <span className="analytics-chart-badge">
            {productRevenue.length} products
          </span>

        </div>


        <div className="analytics-chart-card">

          {productRevenue.length === 0 ? (

            <div className="analytics-no-data">

              No product revenue data
              available.

            </div>

          ) : (

            <div
              style={{
                width: "100%",
                height:
                  Math.max(
                    300,
                    productRevenue.length * 38
                  ) + "px",
              }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={productRevenue}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 25,
                    left: 20,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    stroke="#242a32"
                    strokeDasharray="3 3"
                    horizontal={false}
                  />


                  <XAxis
                    type="number"
                    stroke="#606976"
                    tick={{
                      fill: "#727b88",
                      fontSize: 10,
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      formatCurrency(
                        value
                      )
                    }
                  />


                  <YAxis
                    type="category"
                    dataKey="product"
                    stroke="#606976"
                    tick={{
                      fill: "#a0a8b5",
                      fontSize: 10,
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={145}
                  />


                  <Tooltip
                    contentStyle={{
                      background:
                        "#151920",
                      border:
                        "1px solid #303640",
                      borderRadius:
                        "8px",
                      color:
                        "#e4e7eb",
                    }}
                    formatter={(value) => [
                      formatCurrency(
                        value
                      ),
                      "Revenue",
                    ]}
                  />


                  <Bar
                    dataKey="revenue"
                    fill="#7c8cff"
                    radius={[
                      0,
                      4,
                      4,
                      0,
                    ]}
                    barSize={20}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          DETAILS
          ===================================================== */}

      <div className="analytics-details-grid">


        {/* Business performance */}

        <div className="analytics-detail-panel">

          <div className="analytics-panel-heading">

            <span>
              BUSINESS PERFORMANCE
            </span>

            <h2>
              Key metrics
            </h2>

          </div>


          <div className="analytics-detail-list">

            <div className="analytics-detail-row">

              <span>
                Best-selling product
              </span>

              <strong>
                {bestProduct}
              </strong>

            </div>


            <div className="analytics-detail-row">

              <span>
                Revenue growth
              </span>

              <strong>
                {revenueGrowth >= 0
                  ? "+"
                  : ""}
                {revenueGrowth.toFixed(2)}%
              </strong>

            </div>


            <div className="analytics-detail-row">

              <span>
                Estimated profit
              </span>

              <strong>
                {formatCurrency(
                  estimatedProfit
                )}
              </strong>

            </div>


            <div className="analytics-detail-row">

              <span>
                Profit margin
              </span>

              <strong>
                {profitMargin.toFixed(2)}%
              </strong>

            </div>


            <div className="analytics-detail-row">

              <span>
                Records analysed
              </span>

              <strong>
                {formatNumber(rows)}
              </strong>

            </div>

          </div>

        </div>


        {/* Data quality */}

        <div className="analytics-detail-panel">

          <div className="analytics-panel-heading">

            <span>
              DATA HEALTH
            </span>

            <h2>
              Dataset quality
            </h2>

          </div>


          <div className="quality-score-row">

            <div>

              <span>
                QUALITY SCORE
              </span>

              <strong>
                {qualityScore.toFixed(2)}%
              </strong>

            </div>


            <div className="quality-score-track">

              <div
                style={{
                  width: `${Math.min(
                    Math.max(
                      qualityScore,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>


          <div className="analytics-detail-list">

            <div className="analytics-detail-row">

              <span>
                Missing values
              </span>

              <strong>
                {formatNumber(
                  missingValues
                )}
              </strong>

            </div>


            <div className="analytics-detail-row">

              <span>
                Duplicate rows
              </span>

              <strong>
                {formatNumber(
                  duplicateRows
                )}
              </strong>

            </div>


            <div className="analytics-detail-row">

              <span>
                Invalid dates
              </span>

              <strong>
                {formatNumber(
                  invalidDates
                )}
              </strong>

            </div>

          </div>

        </div>


      </div>


    </div>

  );

}


export default Analytics;