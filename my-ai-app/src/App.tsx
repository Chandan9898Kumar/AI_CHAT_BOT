import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ChatBot from "./pages/ChatBot";
import AgentChat from "./pages/AgentChat";
import ImageClassifier from "./pages/ImageClassifier";
import "./App.css";

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;