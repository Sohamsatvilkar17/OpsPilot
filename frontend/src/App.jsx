import { useState } from "react";
import "./App.css";

import Auth from "./components/Auth";

import Dashboard from "./components/Dashboard";
import Datasets from "./components/Datasets";
import UploadDataset from "./components/UploadDataset";
import Analytics from "./components/Analytics";
import Forecast from "./components/Forecast";
import Anomalies from "./components/Anomalies";
import AIInsights from "./components/AIInsights";
import AIChatbot from "./components/AIChatbot";
import Recommendations from "./components/Recommendations";
import Alerts from "./components/Alerts";


function App() {
  const [username, setUsername] = useState(
    localStorage.getItem("username")
  );

  const [activePage, setActivePage] =
    useState("dashboard");

  const [activeDatasetId, setActiveDatasetId] =
    useState(null);


  const handleLogin = (loggedInUsername) => {
    setUsername(loggedInUsername);
    setActivePage("dashboard");
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setUsername(null);
    setActiveDatasetId(null);
    setActivePage("dashboard");
  };


  const handleDatasetSelect = (datasetId) => {
    setActiveDatasetId(datasetId);
    setActivePage("analytics");
  };


  const handleUploadSuccess = () => {
    setActivePage("datasets");
  };


  const renderPage = () => {

    switch (activePage) {

      case "dashboard":
        return (
          <Dashboard
            activeDatasetId={activeDatasetId}
          />
        );


      case "datasets":
        return (
          <Datasets
            onSelectDataset={handleDatasetSelect}
          />
        );


      case "upload":
        return (
          <UploadDataset
            onUploadSuccess={handleUploadSuccess}
          />
        );


      case "analytics":
        return (
          <Analytics
            activeDatasetId={activeDatasetId}
          />
        );


      case "forecast":
        return (
          <Forecast
            activeDatasetId={activeDatasetId}
          />
        );


      case "anomalies":
        return (
          <Anomalies
            activeDatasetId={activeDatasetId}
          />
        );


      case "insights":
        return (
          <AIInsights
            activeDatasetId={activeDatasetId}
          />
        );


      case "recommendations":
        return (
          <Recommendations
            activeDatasetId={activeDatasetId}
          />
        );


      case "alerts":
        return (
          <Alerts
            activeDatasetId={activeDatasetId}
          />
        );


      case "chatbot":
        return (
          <AIChatbot
            activeDatasetId={activeDatasetId}
          />
        );


      default:
        return (
          <Dashboard
            activeDatasetId={activeDatasetId}
          />
        );
    }
  };


  /*
   * Show login/register page
   * when the user is not logged in.
   */

  if (!username) {
    return (
      <Auth
        onLogin={handleLogin}
      />
    );
  }


  return (
    <div className="app">

      {/* Sidebar */}

      <aside className="sidebar">

        {/* Logo */}

        <div className="logo">

          <div className="logo-icon">
            ⚡
          </div>

          <div>

            <h2>
              OpsPilot
            </h2>

            <span>
              AI Business Intelligence
            </span>

          </div>

        </div>


        {/* Navigation */}

        <nav className="nav-menu">

          {/* Dashboard */}

          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            📊
            <span>
              Dashboard
            </span>
          </button>


          {/* Datasets */}

          <button
            className={
              activePage === "datasets"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("datasets")
            }
          >
            📁
            <span>
              Datasets
            </span>
          </button>


          {/* Upload Dataset */}

          <button
            className={
              activePage === "upload"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("upload")
            }
          >
            📤
            <span>
              Upload Dataset
            </span>
          </button>


          {/* Analytics */}

          <button
            className={
              activePage === "analytics"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("analytics")
            }
          >
            📈
            <span>
              Analytics
            </span>
          </button>


          {/* Forecast */}

          <button
            className={
              activePage === "forecast"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("forecast")
            }
          >
            🔮
            <span>
              Forecast
            </span>
          </button>


          {/* Anomalies */}

          <button
            className={
              activePage === "anomalies"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("anomalies")
            }
          >
            ⚠️
            <span>
              Anomalies
            </span>
          </button>


          {/* AI Insights */}

          <button
            className={
              activePage === "insights"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("insights")
            }
          >
            💡
            <span>
              AI Insights
            </span>
          </button>


          {/* Recommendations */}

          <button
            className={
              activePage === "recommendations"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("recommendations")
            }
          >
            🎯
            <span>
              Recommendations
            </span>
          </button>


          {/* Alerts */}

          <button
            className={
              activePage === "alerts"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("alerts")
            }
          >
            🚨
            <span>
              Alerts
            </span>
          </button>


          {/* AI Assistant */}

          <button
            className={
              activePage === "chatbot"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("chatbot")
            }
          >
            🤖
            <span>
              AI Assistant
            </span>
          </button>

        </nav>


        {/* Sidebar Footer */}

        <div className="sidebar-footer">

          <p>
            Logged in as
          </p>

          <strong>
            {username}
          </strong>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>


          <p>
            Active Dataset
          </p>

          <strong>
            {activeDatasetId
              ? `#${activeDatasetId}`
              : "None"}
          </strong>

          <span>
            {activeDatasetId
              ? "Dataset Selected"
              : "Select a Dataset"}
          </span>

        </div>

      </aside>


      {/* Main Content */}

      <main className="main-content">

        {renderPage()}

      </main>

    </div>
  );
}


export default App;