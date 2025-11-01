import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ChatBot from "./pages/ChatBot/ChatBot";
import AgentChat from "./pages/EnhancedAgentChatBox/AgentChat";
import Home from "./pages/HomePage/Home";
import ImageClassifier from "./pages/ImageClassifier/ImageClassifier";
import TextToSpeech from "./pages/TextToSpeech/TextToSpeech";

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
            <Route path="/classifier" element={<ImageClassifier />} />
            <Route path="/tts" element={<TextToSpeech />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;