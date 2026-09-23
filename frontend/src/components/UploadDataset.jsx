import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function UploadDataset({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile);
    setMessage("");
    setError("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a dataset file.");
      return;
    }

    const allowedExtensions = [
      ".csv",
      ".xlsx",
      ".json"
    ];

    const fileName = file.name.toLowerCase();

    const isAllowed = allowedExtensions.some(
      (extension) => fileName.endsWith(extension)
    );

    if (!isAllowed) {
      setError(
        "Only CSV, Excel (.xlsx), and JSON files are allowed."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/upload/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || "Upload failed"
        );
      }

      setMessage(
        `Dataset uploaded successfully! Dataset ID: #${data.dataset_id}`
      );

      setFile(null);

      event.target.reset();

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>📤 Upload Dataset</h1>

        <p>
          Upload CSV, Excel, or JSON business datasets
        </p>
      </div>

      <div className="upload-card">

        <form onSubmit={handleUpload}>

          <div className="upload-area">

            <div className="upload-icon">
              📁
            </div>

            <h2>
              Select your dataset
            </h2>

            <p>
              Supported formats: CSV, XLSX, JSON
            </p>

            <input
              type="file"
              accept=".csv,.xlsx,.json"
              onChange={handleFileChange}
            />

          </div>

          {file && (
            <div className="selected-file">

              <strong>
                Selected File:
              </strong>

              <span>
                {file.name}
              </span>

            </div>
          )}

          {error && (
            <div className="upload-error">
              ❌ {error}
            </div>
          )}

          {message && (
            <div className="upload-success">
              ✅ {message}
            </div>
          )}

          <button
            type="submit"
            className="upload-button"
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload Dataset"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default UploadDataset;