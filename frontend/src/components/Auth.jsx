import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

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
          "Registration successful. You can now login."
        );

        setIsRegister(false);
        setPassword("");
      } else {
        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("password", password);

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
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-icon">
            ⚡
          </div>

          <div>
            <h1>OpsPilot</h1>
            <p>
              AI Business Intelligence
            </p>
          </div>
        </div>

        <h2>
          {isRegister
            ? "Create Account"
            : "Welcome Back"}
        </h2>

        <p className="auth-subtitle">
          {isRegister
            ? "Create your OpsPilot account"
            : "Login to your business intelligence dashboard"}
        </p>

        {error && (
          <div className="auth-error">
            ❌ {error}
          </div>
        )}

        {message && (
          <div className="auth-success">
            ✅ {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            placeholder="Enter username"
            required
          />

          {isRegister && (
            <>
              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter email"
                required
              />
            </>
          )}

          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter password"
            required
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Login"}
          </button>

        </form>

        <div className="auth-switch">

          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setMessage("");
            }}
          >
            {isRegister
              ? "Login"
              : "Register"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Auth;