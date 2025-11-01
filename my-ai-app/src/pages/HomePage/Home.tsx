import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">AI Assistant</span>
          </h1>
          <p className="hero-subtitle">
            Experience the power of artificial intelligence with our advanced chat bot and image classification tools
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>AI Chat Bot</h3>
              <p>Engage in intelligent conversations with our AI-powered chat bot. Get answers, generate images, and explore endless possibilities.</p>
              <div className="feature-highlights">
                <span className="highlight">✨ Real-time responses</span>
                <span className="highlight">🎨 Image generation</span>
                <span className="highlight">📋 Copy & share</span>
              </div>
              <Link to="/chat" className="feature-btn">
                Try Chat Bot
                <span className="btn-arrow">→</span>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🖼️</div>
              <h3>Image Classifier</h3>
              <p>Upload any image and let our AI identify objects with incredible accuracy using advanced machine learning models.</p>
              <div className="feature-highlights">
                <span className="highlight">🔍 Object detection</span>
                <span className="highlight">⚡ Instant results</span>
                <span className="highlight">📊 Confidence scores</span>
              </div>
              <Link to="/classifier" className="feature-btn">
                Try Classifier
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tech-section">
        <h2 className="section-title">Powered by Advanced Technology</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <div className="tech-logo">🚀</div>
            <h4>Groq LLM</h4>
            <p>Lightning-fast language model for intelligent conversations</p>
          </div>
          <div className="tech-item">
            <div className="tech-logo">🎨</div>
            <h4>FLUX Image Generation</h4>
            <p>State-of-the-art image generation via Hugging Face</p>
          </div>
          <div className="tech-item">
            <div className="tech-logo">🧠</div>
            <h4>TensorFlow.js</h4>
            <p>Client-side machine learning for image classification</p>
          </div>
          <div className="tech-item">
            <div className="tech-logo">⚛️</div>
            <h4>React + TypeScript</h4>
            <p>Modern, type-safe frontend development</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;