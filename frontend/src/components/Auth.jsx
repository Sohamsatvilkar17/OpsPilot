import { useState } from "react";

const API_URL = "https://opspilot-p1wk.onrender.com";


function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {

      /* ================================
         REGISTER
         ================================ */

      if (isRegister) {

        const response = await fetch(
          `${API_URL}/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              username,
              email,
              password,
            }),
          }
        );


        const data = await response.json();


        if (!response.ok) {
          throw new Error(
            data.detail || "Registration failed"
          );
        }


        setMessage(
          "Account created successfully. You can now sign in."
        );

        setIsRegister(false);

        setPassword("");

        return;
      }


      /* ================================
         LOGIN
         ================================ */

      const formData = new URLSearchParams();

      formData.append(
        "username",
        username
      );

      formData.append(
        "password",
        password
      );


      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body: formData,
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed"
        );
      }


      localStorage.setItem(
        "token",
        data.access_token
      );

      localStorage.setItem(
        "username",
        data.username
      );


      onLogin(data.username);

    } catch (error) {

      setError(
        error.message ||
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      {/* Left branding panel */}

      <div className="auth-brand">

        <div className="auth-brand-content">

          <div className="auth-logo">
            <span className="auth-logo-icon">
              ⚡
            </span>

            <span>
              OpsPilot
            </span>
          </div>


          <h1>
            Business operations,
            <br />
            made intelligent.
          </h1>


          <p>
            Analyze your business data, detect
            anomalies, forecast revenue, and get
            AI-powered insights from one platform.
          </p>


          <div className="auth-features">

            <div className="auth-feature">
              <span>↗</span>
              <div>
                <strong>
                  Business Analytics
                </strong>

                <small>
                  Track revenue, growth and performance
                </small>
              </div>
            </div>


            <div className="auth-feature">
              <span>◈</span>
              <div>
                <strong>
                  Machine Learning
                </strong>

                <small>
                  Detect anomalies and forecast trends
                </small>
              </div>
            </div>


            <div className="auth-feature">
              <span>✦</span>
              <div>
                <strong>
                  AI Business Analyst
                </strong>

                <small>
                  Ask questions about your business data
                </small>
              </div>
            </div>

          </div>

        </div>

      </div>


      {/* Login / Register panel */}

      <div className="auth-panel">

        <div className="auth-card">

          <div className="auth-card-header">

            <div className="auth-mobile-logo">
              ⚡
            </div>

            <h2>
              {isRegister
                ? "Create your account"
                : "Welcome back"}
            </h2>

            <p>
              {isRegister
                ? "Create an account to start using OpsPilot."
                : "Sign in to continue to your operations workspace."}
            </p>

          </div>


          {/* Messages */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}


          {/* Form */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter your username"
                autoComplete="username"
                required
              />

            </div>


            {isRegister && (
              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </div>
            )}


            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete={
                  isRegister
                    ? "new-password"
                    : "current-password"
                }
                required
              />

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create account"
                  : "Sign in"}

            </button>

          </form>


          {/* Switch login/register */}

          <div className="auth-switch">

            <span>
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setMessage("");
              }}
            >
              {isRegister
                ? "Sign in"
                : "Create account"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Auth;