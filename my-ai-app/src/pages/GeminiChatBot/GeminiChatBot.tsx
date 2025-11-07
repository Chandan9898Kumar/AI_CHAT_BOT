import { useState } from "react";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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

const GeminiChatBot = () => {
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
      const response = await fetch("http://localhost:3001/api/chat-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
      const aiText = data.response || "Sorry, I could not generate a response.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Error connecting to Gemini AI service: " + error,
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
          <Message />
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
                  {!message.isUser && <div className="ai-avatar">🧠</div>}
                  <div className="message-bubble">
                    <pre className="message-text">{message.text}</pre>
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
              placeholder="Ask Gemini anything..."
              disabled={loading}
              className="message-input"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="send-button"
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default GeminiChatBot;
