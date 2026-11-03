import { useRef, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function UploadDataset({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile || null);
    setMessage("");
    setError("");
  };


  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };


  const handleRemoveFile = () => {
    setFile(null);
    setMessage("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      (extension) =>
        fileName.endsWith(extension)
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
          data.error ||
          data.detail ||
          "Upload failed"
        );
      }


      setMessage(
        `Dataset uploaded successfully. Dataset #${data.dataset_id} is now available in your workspace.`
      );


      setFile(null);


      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }


      if (onUploadSuccess) {
        onUploadSuccess(data);
      }


    } catch (error) {

      console.error(
        "Dataset upload error:",
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };


  const getFileType = () => {
    if (!file) {
      return "";
    }

    const extension =
      file.name.split(".").pop();

    return extension
      ? extension.toUpperCase()
      : "";
  };


  const getFileSize = () => {
    if (!file) {
      return "";
    }


    const sizeInKB =
      file.size / 1024;


    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    }


    return `${(
      sizeInKB / 1024
    ).toFixed(1)} MB`;
  };


  return (
    <div className="page-container upload-page">


      {/* =========================================
          HEADER
          ========================================= */}

      <div className="page-header upload-header">

        <div>

          <div className="page-eyebrow">
            DATA INGESTION
          </div>

          <h1>
            Upload Dataset
          </h1>

          <p>
            Bring your business data into OpsPilot
            for automated quality checks, analytics,
            anomaly detection, and AI insights.
          </p>

        </div>

      </div>


      {/* =========================================
          MAIN UPLOAD LAYOUT
          ========================================= */}

      <div className="upload-workspace">


        {/* =======================================
            UPLOAD PANEL
            ======================================= */}

        <div className="upload-main-card">

          <form onSubmit={handleUpload}>


            <div className="upload-panel-header">

              <div>

                <span className="upload-panel-label">
                  STEP 01
                </span>

                <h2>
                  Choose your dataset
                </h2>

                <p>
                  Select a supported business data
                  file from your computer.
                </p>

              </div>

            </div>


            {/* File selector */}

            <div
              className={`dataset-drop-zone ${
                file ? "has-file" : ""
              }`}
              onClick={
                file
                  ? undefined
                  : handleChooseFile
              }
            >

              {!file ? (

                <>

                  <div className="upload-large-icon">
                    ↑
                  </div>

                  <h3>
                    Select a dataset file
                  </h3>

                  <p>
                    Choose a CSV, Excel, or JSON file
                    to begin.
                  </p>

                  <button
                    type="button"
                    className="choose-file-button"
                    onClick={handleChooseFile}
                  >
                    Choose file
                  </button>

                  <div className="supported-formats">

                    <span>CSV</span>
                    <span>XLSX</span>
                    <span>JSON</span>

                  </div>

                </>

              ) : (

                <div className="selected-file-preview">

                  <div className="selected-file-icon">
                    {getFileType()}
                  </div>

                  <div className="selected-file-details">

                    <span className="selected-file-label">
                      SELECTED DATASET
                    </span>

                    <strong
                      title={file.name}
                    >
                      {file.name}
                    </strong>

                    <div className="selected-file-meta">

                      <span>
                        {getFileType()}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {getFileSize()}
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="remove-file-button"
                    onClick={handleRemoveFile}
                  >
                    ×
                  </button>

                </div>

              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.json"
                onChange={handleFileChange}
                className="hidden-file-input"
              />

            </div>


            {/* Messages */}

            {error && (

              <div className="upload-message upload-message-error">

                <div className="upload-message-icon">
                  !
                </div>

                <div>
                  <strong>
                    Upload could not be completed
                  </strong>

                  <p>
                    {error}
                  </p>
                </div>

              </div>

            )}


            {message && (

              <div className="upload-message upload-message-success">

                <div className="upload-message-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Dataset uploaded
                  </strong>

                  <p>
                    {message}
                  </p>
                </div>

              </div>

            )}


            {/* Upload action */}

            <div className="upload-action-row">

              <div className="upload-action-info">

                <span className="upload-status-dot"></span>

                <span>
                  Your data is processed inside
                  your OpsPilot workspace.
                </span>

              </div>


              <button
                type="submit"
                className="upload-submit-button"
                disabled={loading || !file}
              >

                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Processing dataset...
                  </>
                ) : (
                  <>
                    Upload dataset
                    <span>→</span>
                  </>
                )}

              </button>

            </div>

          </form>

        </div>


        {/* =======================================
            INFORMATION PANEL
            ======================================= */}

        <aside className="upload-info-panel">


          <div className="upload-info-heading">

            <span className="upload-panel-label">
              WORKFLOW
            </span>

            <h2>
              What happens next?
            </h2>

          </div>


          <div className="upload-workflow">


            <div className="workflow-step">

              <div className="workflow-number">
                01
              </div>

              <div>

                <h3>
                  Data validation
                </h3>

                <p>
                  OpsPilot checks the uploaded
                  file structure and supported
                  data format.
                </p>

              </div>

            </div>


            <div className="workflow-line"></div>


            <div className="workflow-step">

              <div className="workflow-number">
                02
              </div>

              <div>

                <h3>
                  Quality analysis
                </h3>

                <p>
                  Missing values, duplicates,
                  and other data quality issues
                  are identified.
                </p>

              </div>

            </div>


            <div className="workflow-line"></div>


            <div className="workflow-step">

              <div className="workflow-number">
                03
              </div>

              <div>

                <h3>
                  Business analytics
                </h3>

                <p>
                  Key metrics and business
                  insights are generated from
                  your dataset.
                </p>

              </div>

            </div>


            <div className="workflow-line"></div>


            <div className="workflow-step">

              <div className="workflow-number">
                04
              </div>

              <div>

                <h3>
                  AI intelligence
                </h3>

                <p>
                  Anomalies, recommendations,
                  forecasts, and AI analysis become
                  available for the dataset.
                </p>

              </div>

            </div>

          </div>


          <div className="upload-format-card">

            <span>
              SUPPORTED FORMATS
            </span>

            <div>

              <strong>
                CSV
              </strong>

              <strong>
                XLSX
              </strong>

              <strong>
                JSON
              </strong>

            </div>

          </div>


        </aside>

      </div>

    </div>
  );
}

export default UploadDataset;