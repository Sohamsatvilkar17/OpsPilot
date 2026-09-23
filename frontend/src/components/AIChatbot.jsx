import { useState } from "react";


const API_URL = "http://127.0.0.1:8000";


function AIChatbot({ activeDatasetId }) {

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! 👋 I'm your OpsPilot AI Assistant. Ask me anything about your active dataset!"
    }
  ]);


  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);


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
          text: "⚠️ Please select a dataset first."
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

        throw new Error(
          "Please login first."
        );

      }


      const response = await fetch(
        `${API_URL}/chat/${activeDatasetId}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
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
          data.error ||
          "Failed to get AI response"
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
          text: `❌ ${error.message}`
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


  const quickQuestions = [

    "What is the total revenue?",

    "What is the best product?",

    "How is the data quality?",

    "Are there any anomalies?",

    "Give me recommendations"

  ];


  return (

    <div className="page-container">


      <div className="page-header">

        <h1>
          🤖 AI Business Assistant
        </h1>

        <p>
          Ask intelligent questions about your active dataset
        </p>

      </div>


      <div className="chatbot-dataset-info">

        <span>
          📁 Active Dataset
        </span>

        <strong>

          {activeDatasetId
            ? `Dataset #${activeDatasetId}`
            : "No dataset selected"}

        </strong>

      </div>


      <div className="chat-container">


        <div className="chat-header">

          <div className="chatbot-avatar">
            🤖
          </div>


          <div>

            <h3>
              OpsPilot AI
            </h3>

            <span>
              ● Online
            </span>

          </div>

        </div>


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
                  ? "👤"
                  : "🤖"}

              </div>


              <div className="message-content">

                {message.text}

              </div>

            </div>

          ))}


          {loading && (

            <div className="message bot-message">

              <div className="message-avatar">
                🤖
              </div>


              <div className="message-content typing">

                Thinking...

              </div>

            </div>

          )}

        </div>


        <div className="quick-questions">

          <p>
            💡 Try asking:
          </p>


          <div className="quick-question-buttons">

            {quickQuestions.map(
              (quickQuestion, index) => (

                <button
                  key={index}
                  onClick={() =>
                    sendMessage(quickQuestion)
                  }
                  disabled={loading}
                >

                  {quickQuestion}

                </button>

              )
            )}

          </div>

        </div>


        <div className="chat-input-container">

          <input
            type="text"
            placeholder="Ask about your business data..."
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={loading}
          />


          <button
            onClick={() => sendMessage()}
            disabled={loading}
          >

            {loading
              ? "..."
              : "Send 🚀"}

          </button>

        </div>

      </div>

    </div>

  );

}


export default AIChatbot;