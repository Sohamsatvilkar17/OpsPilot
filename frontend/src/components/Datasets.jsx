import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Datasets({ onSelectDataset }) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/datasets/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Session expired. Please login again.");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch datasets");
        }

        return response.json();
      })
      .then((data) => {
        setDatasets(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        Loading datasets...
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>📁 Datasets</h1>
        <p>
          View and manage your uploaded business datasets
        </p>
      </div>

      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {!error && datasets.length === 0 && (
        <div className="empty-state">
          <p>No datasets found.</p>
        </div>
      )}

      {!error && datasets.length > 0 && (
        <div className="dataset-list">

          {datasets.map((dataset) => (
            <div
              className="dataset-card"
              key={dataset.id}
            >

              <div className="dataset-info">

                <h3>
                  📄 {dataset.file_name}
                </h3>

                <p>
                  Dataset ID: #{dataset.id}
                </p>

                <p>
                  File Type: {dataset.file_type}
                </p>

                <p>
                  Rows: {dataset.rows}
                </p>

                <p>
                  Uploaded:{" "}
                  {new Date(
                    dataset.uploaded_at
                  ).toLocaleString()}
                </p>

              </div>

              <button
                className="select-button"
                onClick={() =>
                  onSelectDataset(dataset.id)
                }
              >
                View Analytics
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Datasets;