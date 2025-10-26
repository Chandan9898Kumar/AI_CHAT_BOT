import { useState } from "react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import "./AgentChat.css";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  toolsUsed?: string[];
  toolResults?: Array<{
    tool_name: string;
    content: string;
    id: string;
  }>;
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const handleMessageAction = (event: React.MouseEvent) => {
  const button = event.target as HTMLButtonElement;
  const text = button.dataset.text;
  if (button.classList.contains("copy-btn") && text) {
    copyToClipboard(text);
  }
};

function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat-enhanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
      const aiText = data.response || "Sorry, I could not generate a response.";

      // Remove duplicate tool results
      const uniqueToolResults = data.tool_results ? 
        data.tool_results.filter((result: any, index: number, self: any[]) => 
          index === self.findIndex(r => r.tool_name === result.tool_name && r.content === result.content)
        ) : [];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date(),
        toolsUsed: data.tools_used || [],
        toolResults: uniqueToolResults,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Error connecting to AI Agent service: " + error,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <Header />

      <div className="main-content">
        {messages.length === 0 ? (
          <div className="welcome-container">
            <Message />
            <div className="agent-features">
              <h3>🤖 Enhanced AI Agent Features:</h3>
              <div className="feature-grid">
                <div className="feature-card">
                  <span className="feature-icon">🌤️</span>
                  <span className="feature-text">Real-time Weather</span>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">🧮</span>
                  <span className="feature-text">Calculator</span>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">🔍</span>
                  <span className="feature-text">Web Search</span>
                </div>
              </div>
              <div className="example-queries">
                <p><strong>Try asking:</strong></p>
                <ul>
                  <li>"What's the weather in Tokyo?"</li>
                  <li>"Calculate 15 * 23 + 100"</li>
                  <li>"Weather in Paris and calculate 50% of 200"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-container" onClick={handleMessageAction}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${
                  message.isUser ? "user-wrapper" : "ai-wrapper"
                }`}
              >
                <div className="message-content">
                  {!message.isUser && <div className="ai-avatar">🤖</div>}
                  <div className="message-bubble">
                    <pre className="message-text">{message.text}</pre>
                    
                    {/* Show tools used */}
                    {!message.isUser && message.toolsUsed && message.toolsUsed.length > 0 && (
                      <div className="tools-used">
                        <div className="tools-header">🛠️ Tools Used:</div>
                        <div className="tools-list">
                          {message.toolsUsed.map((tool, index) => (
                            <span key={index} className="tool-badge">
                              {tool === 'get_weather' && '🌤️ Weather'}
                              {tool === 'calculator' && '🧮 Calculator'}
                              {tool === 'web_search' && '🔍 Search'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show raw tool results */}
                    {!message.isUser && message.toolResults && message.toolResults.length > 0 && (
                      <div className="tool-results">
                        <div className="results-header">📊 Raw Tool Data:</div>
                        {message.toolResults.map((result, index) => (
                          <div key={index} className="tool-result">
                            <strong>{result.tool_name}:</strong> {result.content}
                          </div>
                        ))}
                      </div>
                    )}

                    {!message.isUser && (
                      <button
                        className="copy-btn"
                        data-text={message.text}
                        title="Copy message"
                      >
                        📋
                      </button>
                    )}
                  </div>
                  {message.isUser && <div className="user-avatar">👤</div>}
                </div>
              </div>
            ))}
            {loading && <Loader />}
          </div>
        )}

        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about weather, calculations, or search..."
              disabled={loading}
              className="message-input"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="send-button"
            >
              {loading ? "⏳" : "🚀"}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

export default AgentChat;