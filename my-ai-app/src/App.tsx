import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ChatBot from "./pages/GroqChatBot/ChatBot";
import AgentChat from "./pages/EnhancedGroqAgentChatBox/AgentChat";
import Home from "./pages/HomePage/Home";
import ImageClassifier from "./pages/TensorFlowImageClassifier/ImageClassifier";
import TextToSpeech from "./pages/GroqTextToSpeech/TextToSpeech";
import GeminiChatBot from "./pages/GeminiChatBot/GeminiChatBot";
function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/agent" element={<AgentChat />} />
            <Route path="/gemini" element={<GeminiChatBot />} />
            <Route path="/classifier" element={<ImageClassifier />} />
            <Route path="/tts" element={<TextToSpeech />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
