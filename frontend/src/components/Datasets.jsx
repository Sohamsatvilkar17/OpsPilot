import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";


function Datasets({ onSelectDataset }) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    loadDatasets();
  }, []);


  const loadDatasets = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");


      if (!token) {
        throw new Error("Please login first.");
      }


      const response = await fetch(
        `${API_URL}/datasets/`,
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


      if (!response.ok) {
        throw new Error(
          "Unable to load your datasets."
        );
      }


      const data = await response.json();

      setDatasets(data);

    } catch (error) {

      console.error(
        "Dataset loading error:",
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };


  const getFileType = (fileName, fileType) => {
    const extension =
      fileType ||
      fileName?.split(".").pop() ||
      "";

    return extension
      .replace(".", "")
      .toUpperCase();
  };


  const getFileIcon = (fileName, fileType) => {
    const extension =
      (
        fileType ||
        fileName?.split(".").pop() ||
        ""
      ).toLowerCase();


    if (extension.includes("xlsx")) {
      return "▦";
    }


    if (extension.includes("json")) {
      return "{ }";
    }


    return "CSV";
  };


  const formatRows = (rows) => {
    return Number(rows || 0).toLocaleString(
      "en-IN"
    );
  };


  const formatDate = (date) => {
    if (!date) {
      return "Unknown";
    }


    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };


  const formatTime = (date) => {
    if (!date) {
      return "";
    }


    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  /*
    Loading state
  */

  if (loading) {
    return (
      <div className="page-container datasets-page">

        <div className="page-header datasets-header">

          <div>
            <div className="page-eyebrow">
              DATA WORKSPACE
            </div>

            <h1>
              Datasets
            </h1>

            <p>
              Manage and explore the business data
              powering your OpsPilot analysis.
            </p>
          </div>

        </div>


        <div className="datasets-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading your datasets
          </p>

        </div>

      </div>
    );
  }


  /*
    Error state
  */

  if (error) {
    return (
      <div className="page-container datasets-page">

        <div className="page-header datasets-header">

          <div>
            <div className="page-eyebrow">
              DATA WORKSPACE
            </div>

            <h1>
              Datasets
            </h1>

            <p>
              Manage and explore your business data.
            </p>
          </div>

          <button
            className="dataset-refresh-button"
            onClick={loadDatasets}
          >
            ↻ Refresh
          </button>

        </div>


        <div className="datasets-error">

          <div className="datasets-error-icon">
            !
          </div>

          <div className="datasets-error-content">

            <h3>
              Unable to load datasets
            </h3>

            <p>
              {error}
            </p>

          </div>

          <button
            className="primary-button"
            onClick={loadDatasets}
          >
            Try again
          </button>

        </div>

      </div>
    );
  }


  /*
    Main page
  */

  return (
    <div className="page-container datasets-page">


      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <div className="page-header datasets-header">

        <div>

          <div className="page-eyebrow">
            DATA WORKSPACE
          </div>

          <h1>
            Datasets
          </h1>

          <p>
            Manage and explore the business data
            powering your OpsPilot analysis.
          </p>

        </div>


        <div className="datasets-header-actions">

          <button
            className="dataset-refresh-button"
            onClick={loadDatasets}
          >
            ↻ Refresh
          </button>

        </div>

      </div>


      {/* =========================================
          DATASET SUMMARY
          ========================================= */}

      <div className="dataset-summary-bar">

        <div className="dataset-summary-item">

          <span className="dataset-summary-label">
            AVAILABLE DATASETS
          </span>

          <strong>
            {datasets.length}
          </strong>

        </div>


        <div className="dataset-summary-divider"></div>


        <div className="dataset-summary-item">

          <span className="dataset-summary-label">
            TOTAL RECORDS
          </span>

          <strong>
            {formatRows(
              datasets.reduce(
                (total, dataset) =>
                  total +
                  Number(dataset.rows || 0),
                0
              )
            )}
          </strong>

        </div>


        <div className="dataset-summary-divider"></div>


        <div className="dataset-summary-info">

          <span className="dataset-summary-dot"></span>

          <span>
            Your datasets are private to your account
          </span>

        </div>

      </div>


      {/* =========================================
          EMPTY STATE
          ========================================= */}

      {datasets.length === 0 && (

        <div className="datasets-empty">

          <div className="datasets-empty-icon">
            +
          </div>

          <h2>
            Your workspace is empty
          </h2>

          <p>
            Upload a CSV, Excel, or JSON dataset
            to start analysing your business data.
          </p>

          <div className="datasets-supported">

            <span>
              CSV
            </span>

            <span>
              XLSX
            </span>

            <span>
              JSON
            </span>

          </div>

        </div>

      )}


      {/* =========================================
          DATASET GRID
          ========================================= */}

      {datasets.length > 0 && (

        <section>

          <div className="datasets-section-heading">

            <div>

              <h2>
                Your datasets
              </h2>

              <p>
                Select a dataset to open its analytics workspace.
              </p>

            </div>

            <span className="dataset-count">
              {datasets.length}{" "}
              {datasets.length === 1
                ? "dataset"
                : "datasets"}
            </span>

          </div>


          <div className="datasets-grid">

            {datasets.map((dataset) => {

              const fileType =
                getFileType(
                  dataset.file_name,
                  dataset.file_type
                );


              const fileIcon =
                getFileIcon(
                  dataset.file_name,
                  dataset.file_type
                );


              return (
                <div
                  className="dataset-workspace-card"
                  key={dataset.id}
                >


                  {/* Card top */}

                  <div className="dataset-card-top">

                    <div
                      className={`dataset-file-icon file-${fileType.toLowerCase()}`}
                    >
                      {fileIcon}
                    </div>


                    <div className="dataset-file-type">
                      {fileType}
                    </div>

                  </div>


                  {/* File information */}

                  <div className="dataset-file-info">

                    <h3
                      title={dataset.file_name}
                    >
                      {dataset.file_name}
                    </h3>

                    <p>
                      Dataset #{dataset.id}
                    </p>

                  </div>


                  {/* Dataset statistics */}

                  <div className="dataset-stat-grid">

                    <div>

                      <span>
                        RECORDS
                      </span>

                      <strong>
                        {formatRows(
                          dataset.rows
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        FORMAT
                      </span>

                      <strong>
                        {fileType}
                      </strong>

                    </div>

                  </div>


                  {/* Upload information */}

                  <div className="dataset-upload-info">

                    <span>
                      Uploaded
                    </span>

                    <strong>
                      {formatDate(
                        dataset.uploaded_at
                      )}
                    </strong>

                    <small>
                      {formatTime(
                        dataset.uploaded_at
                      )}
                    </small>

                  </div>


                  {/* Action */}

                  <button
                    className="dataset-open-button"
                    onClick={() =>
                      onSelectDataset(
                        dataset.id
                      )
                    }
                  >
                    <span>
                      Open analytics
                    </span>

                    <span>
                      →
                    </span>
                  </button>


                </div>
              );
            })}

          </div>

        </section>

      )}

    </div>
  );
}


export default Datasets;