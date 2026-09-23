import { useEffect, useState } from "react";


const API_URL = "http://127.0.0.1:8000";


function Anomalies({ activeDatasetId }) {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    if (!activeDatasetId) {

      setLoading(false);

      return;
    }

    loadAnomalies();

  }, [activeDatasetId]);


  const loadAnomalies = async () => {

    try {

      setLoading(true);

      setError("");


      const token = localStorage.getItem("token");


      if (!token) {

        throw new Error(
          "Please login first."
        );

      }


      const url =
        `${API_URL}/analytics/${activeDatasetId}/anomalies`;


      console.log(
        "Loading anomalies from:",
        url
      );


      const response = await fetch(
        url,
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


      console.log(
        "Anomaly API response:",
        result
      );


      if (!response.ok) {

        throw new Error(
          result.error ||
          result.detail ||
          `Server returned status ${response.status}`
        );

      }


      if (result.error) {

        throw new Error(
          result.error
        );

      }


      if (!result.anomaly_detection) {

        throw new Error(
          "Anomaly detection data was not returned by the server."
        );

      }


      setData(
        result.anomaly_detection
      );


    } catch (error) {

      console.error(
        "Anomaly detection error:",
        error
      );

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  if (!activeDatasetId) {

    return (

      <div className="page-container">

        <div className="page-header">

          <h1>
            ⚠️ Anomaly Detection
          </h1>

          <p>
            Detect unusual transactions using
            machine learning.
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

        <div className="page-header">

          <h1>
            ⚠️ Anomaly Detection
          </h1>

          <p>
            Machine-learning powered detection
            of unusual business transactions.
          </p>

        </div>


        <div className="loading">

          🤖 Running ML anomaly detection...

        </div>

      </div>

    );

  }


  if (error) {

    return (

      <div className="page-container">

        <div className="page-header">

          <h1>
            ⚠️ Anomaly Detection
          </h1>

          <p>
            Machine-learning powered detection
            of unusual business transactions.
          </p>

        </div>


        <div className="error">

          ❌ {error}

        </div>


        <div className="analytics-section">

          <h2>
            🔧 Troubleshooting
          </h2>

          <p>
            The backend anomaly API is available,
            but the frontend could not load the result.
          </p>


          <button
            onClick={loadAnomalies}
            className="retry-button"
          >
            🔄 Try Again
          </button>

        </div>

      </div>

    );

  }


  const anomalies =
    data?.anomalies || [];


  const anomalyCount =
    data?.anomaly_records || 0;


  const anomalyPercentage =
    data?.anomaly_percentage || 0;


  return (

    <div className="page-container">


      {/* Header */}

      <div className="page-header">

        <h1>
          ⚠️ Anomaly Detection
        </h1>

        <p>
          Machine-learning powered detection
          of unusual business transactions.
        </p>

      </div>


      {/* Summary */}

      <div className="analytics-section">

        <h2>
          🤖 ML Detection Summary
        </h2>


        <div className="analytics-results">


          <div className="metric-card">

            <span>
              ⚠️
            </span>

            <h3>
              Anomalies Detected
            </h3>

            <p>
              {anomalyCount}
            </p>

          </div>


          <div className="metric-card">

            <span>
              📊
            </span>

            <h3>
              Anomaly Rate
            </h3>

            <p>
              {anomalyPercentage}%
            </p>

          </div>


          <div className="metric-card">

            <span>
              🧠
            </span>

            <h3>
              ML Model
            </h3>

            <p>
              Isolation Forest
            </p>

          </div>


          <div className="metric-card">

            <span>
              🔎
            </span>

            <h3>
              Dataset
            </h3>

            <p>
              #{activeDatasetId}
            </p>

          </div>


        </div>

      </div>


      {/* Status */}

      <div className="analytics-section">

        {anomalyCount > 0 ? (

          <div className="anomaly-warning">

            <h2>
              ⚠️ Unusual Transactions Found
            </h2>

            <p>
              The machine learning model identified{" "}

              <strong>
                {anomalyCount}
              </strong>{" "}

              unusual transaction(s).
            </p>

            <p>
              These transactions should be reviewed
              to determine whether they represent
              data errors, unusual customer behavior,
              or genuine business events.
            </p>

          </div>

        ) : (

          <div className="anomaly-success">

            <h2>
              ✅ No Significant Anomalies
            </h2>

            <p>
              The machine learning model did not
              detect unusual transactions in this
              dataset.
            </p>

          </div>

        )}

      </div>


      {/* Detected Transactions */}

      <div className="analytics-section">

        <h2>
          🔍 Detected Transactions
        </h2>


        {anomalies.length === 0 ? (

          <div className="empty-state">

            ✅ No anomalous transactions found.

          </div>

        ) : (

          <div className="table-container">

            <table className="anomaly-table">

              <thead>

                <tr>

                  <th>
                    Row
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Quantity
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Revenue
                  </th>

                </tr>

              </thead>


              <tbody>

                {anomalies.map(
                  (anomaly, index) => (

                    <tr key={index}>

                      <td>
                        {anomaly.row_number}
                      </td>


                      <td>
                        {anomaly.date || "-"}
                      </td>


                      <td>

                        <strong>
                          {anomaly.product || "-"}
                        </strong>

                      </td>


                      <td>
                        {anomaly.quantity ?? "-"}
                      </td>


                      <td>

                        ₹
                        {Number(
                          anomaly.price || 0
                        ).toLocaleString()}

                      </td>


                      <td>

                        <strong>

                          ₹
                          {Number(
                            anomaly.revenue || 0
                          ).toLocaleString()}

                        </strong>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ML Explanation */}

      <div className="analytics-section">

        <h2>
          🧠 How Anomaly Detection Works
        </h2>


        <div className="product-list">


          <div className="product-row">

            <span>
              Algorithm
            </span>

            <strong>
              Isolation Forest
            </strong>

          </div>


          <div className="product-row">

            <span>
              Input Features
            </span>

            <strong>
              Quantity, Price, Revenue
            </strong>

          </div>


          <div className="product-row">

            <span>
              Detected Records
            </span>

            <strong>
              {anomalyCount}
            </strong>

          </div>


          <div className="product-row">

            <span>
              Anomaly Rate
            </span>

            <strong>
              {anomalyPercentage}%
            </strong>

          </div>


          <div className="product-row">

            <span>
              Purpose
            </span>

            <strong>
              Detect unusual transactions
            </strong>

          </div>


        </div>

      </div>


    </div>

  );

}


export default Anomalies;