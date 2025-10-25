import { useState } from "react";
import "./App.css";
import Loader from "./components/Loader";
import Message from "./components/Message";
import Header from "./components/Header";
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string;
}

// ✅ GOOD: Function created once, reused forever
async function generateImage(prompt: string) {
  const response = await fetch("http://localhost:3001/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.imageUrl;
}

// ✅ GOOD: Function created once, reused forever,Same reference across all renders, No unnecessary re-renders. and Better memory efficiency.
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

function App() {
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

    // Check if user is requesting an image
    const imageKeywords = [
      "image",
      "picture",
      "photo",
      "generate image",
      "create image",
      "draw",
    ];
    const isImageRequest = imageKeywords.some((keyword) =>
      currentInput.toLowerCase().includes(keyword)
    );

    if (isImageRequest) {
      try {
        const imageUrl = await generateImage(currentInput);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Here's the image I generated for you:",
          isUser: false,
          timestamp: new Date(),
          imageUrl: imageUrl,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setLoading(false);
        return;
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `${error}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
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
        text: "Error connecting to AI service." + error,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  console.log(messages);
  return (
    <div className="app">
      <Header />

      <div className="main-content">
        {messages.length === 0 ? (
          <Message />
        ) : (
          <div className="messages-container">
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
                    {message.imageUrl && (
                      <img
                        src={message.imageUrl}
                        alt="Generated image"
                        className="generated-image"
                      />
                    )}
                    {!message.isUser && (
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(message.text)}
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
              placeholder="Ask me anything..."
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
}

export default App;
