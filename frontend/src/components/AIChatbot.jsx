import { useState } from "react";

const API_URL = "https://opspilot-p1wk.onrender.com";

function AIChatbot({ activeDatasetId }) {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text:
        "Hello! I'm your OpsPilot AI Assistant. Ask me anything about your active business dataset."
    }
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "What is the total revenue?",
    "What is the best product?",
    "How is the data quality?",
    "Are there any anomalies?",
    "Give me recommendations"
  ];

  const sendMessage = async (customQuestion = null) => {
    const userQuestion =
      customQuestion || question.trim();

    if (!userQuestion || loading) {
      return;
    }

    if (!activeDatasetId) {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "bot",
          text: "Please select a dataset before asking a question."
        }
      ]);

      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        type: "user",
        text: userQuestion
      }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${API_URL}/chat/${activeDatasetId}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            question: userQuestion
          })
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

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "Failed to get AI response"
        );
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "bot",
          text: data.response
        }
      ]);
    } catch (error) {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "bot",
          text: error.message
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        type: "bot",
        text:
          "Chat cleared. What would you like to know about your business data?"
      }
    ]);
  };

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <div className="page-eyebrow">
            AI BUSINESS ANALYST
          </div>

          <h1>
            AI Assistant
          </h1>

          <p>
            Ask questions about your business data and
            receive data-grounded analysis from OpsPilot.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={clearChat}
          disabled={loading}
        >
          Clear Chat
        </button>

      </div>


      {/* DATASET CONTEXT */}
      <div className="chatbot-dataset-info">

        <div className="chatbot-dataset-main">

          <div className="chatbot-dataset-icon">
            ◉
          </div>

          <div>
            <span>
              ACTIVE DATASET
            </span>

            <strong>
              {activeDatasetId
                ? `Dataset #${activeDatasetId}`
                : "No dataset selected"}
            </strong>
          </div>

        </div>

        <div
          className={
            activeDatasetId
              ? "chatbot-context-status active"
              : "chatbot-context-status"
          }
        >
          <span>●</span>

          {activeDatasetId
            ? "Dataset context available"
            : "Select a dataset"}
        </div>

      </div>


      {/* MAIN CHAT */}
      <div className="chat-container">

        {/* CHAT HEADER */}
        <div className="chat-header">

          <div className="chatbot-avatar">
            ✦
          </div>

          <div className="chat-header-info">

            <h3>
              OpsPilot AI
            </h3>

            <span>
              <i></i>
              Business intelligence assistant
            </span>

          </div>

        </div>


        {/* CHAT MESSAGES */}
        <div className="chat-messages">

          {messages.map((message, index) => (

            <div
              key={index}
              className={
                message.type === "user"
                  ? "message user-message"
                  : "message bot-message"
              }
            >

              <div className="message-avatar">
                {message.type === "user"
                  ? "You"
                  : "AI"}
              </div>


              <div className="message-content">

                {message.text}

              </div>

            </div>

          ))}


          {loading && (

            <div className="message bot-message">

              <div className="message-avatar">
                AI
              </div>

              <div className="message-content typing">

                <span></span>
                <span></span>
                <span></span>

                <em>
                  Analyzing your dataset...
                </em>

              </div>

            </div>

          )}

        </div>


        {/* QUICK QUESTIONS */}
        <div className="quick-questions">

          <div className="quick-question-header">

            <span>
              Suggested questions
            </span>

            <small>
              Start with one of these
            </small>

          </div>


          <div className="quick-question-buttons">

            {quickQuestions.map(
              (quickQuestion, index) => (

                <button
                  key={index}
                  onClick={() =>
                    sendMessage(quickQuestion)
                  }
                  disabled={
                    loading || !activeDatasetId
                  }
                >
                  {quickQuestion}
                </button>

              )
            )}

          </div>

        </div>


        {/* INPUT */}
        <div className="chat-input-container">

          <div className="chat-input-wrapper">

            <input
              type="text"
              placeholder={
                activeDatasetId
                  ? "Ask about revenue, products, anomalies..."
                  : "Select a dataset to start asking questions..."
              }
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={
                loading || !activeDatasetId
              }
            />

            <button
              onClick={() => sendMessage()}
              disabled={
                loading ||
                !question.trim() ||
                !activeDatasetId
              }
            >
              {loading ? "..." : "Send"}
            </button>

          </div>

          <div className="chat-input-hint">
            Press Enter to send
          </div>

        </div>

      </div>


      {/* CAPABILITIES */}
      <div className="chat-capabilities">

        <div className="chat-capability">

          <div className="chat-capability-icon">
            ₹
          </div>

          <div>
            <strong>
              Financial Analysis
            </strong>

            <p>
              Revenue, growth, margins and performance.
            </p>
          </div>

        </div>


        <div className="chat-capability">

          <div className="chat-capability-icon">
            ★
          </div>

          <div>
            <strong>
              Product Intelligence
            </strong>

            <p>
              Identify strong and weak product performance.
            </p>
          </div>

        </div>


        <div className="chat-capability">

          <div className="chat-capability-icon">
            !
          </div>

          <div>
            <strong>
              Risk Detection
            </strong>

            <p>
              Explore anomalies and important business signals.
            </p>
          </div>

        </div>


        <div className="chat-capability">

          <div className="chat-capability-icon">
            →
          </div>

          <div>
            <strong>
              Recommendations
            </strong>

            <p>
              Ask OpsPilot for practical next actions.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AIChatbot;