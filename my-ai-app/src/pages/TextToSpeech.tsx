import React, { useState } from "react";
import "./TextToSpeech.css";

const voices = [
  "Arista-PlayAI",
  "Atlas-PlayAI",
  "Basil-PlayAI",
  "Briggs-PlayAI",
  "Calum-PlayAI",
  "Celeste-PlayAI",
  "Cheyenne-PlayAI",
  "Chip-PlayAI",
  "Cillian-PlayAI",
  "Deedee-PlayAI",
  "Fritz-PlayAI",
  "Gail-PlayAI",
  "Indigo-PlayAI",
  "Mamaw-PlayAI",
  "Mason-PlayAI",
  "Mikail-PlayAI",
  "Mitch-PlayAI",
  "Quinn-PlayAI",
  "Thunder-PlayAI",
];

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedVoice, setSelectedVoice] = useState(voices[0]);

  const handleTextToSpeech = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });

      const data = await response.json();
      console.log("TTS Response:", data); // Debug log

      if (data.audioUrl && !data.audioUrl.includes("eyJlcnJvciI6")) {
        setAudioUrl(data.audioUrl);
        console.log("Audio URL set:", data.audioUrl.substring(0, 50) + "..."); // Debug log
      } else {
        // Check if audioUrl contains an error (base64 encoded)
        if (data.audioUrl && data.audioUrl.includes("base64,")) {
          try {
            const base64Data = data.audioUrl.split("base64,")[1];
            const decodedError = atob(base64Data);
            console.error("Decoded TTS Error:", decodedError);
            alert("TTS Error: " + decodedError);
          } catch (error) {
            console.error("TTS Error:", data.error || "Unknown error", error);
            alert("Error: " + (data.error || "Unknown error"));
          }
        } else {
          console.error("TTS Error:", data.error);
          alert("Error: " + (data.error || "Unknown error"));
        }
      }
    } catch (error) {
      console.error("TTS Error:", error);
      alert("Network error: " + error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    const audio = document.querySelector(".tts-audio") as HTMLAudioElement;
    if (audio) {
      audio.play().catch((err) => {
        console.error("Audio play error:", err);
        alert("Could not play audio. Try clicking the play button manually.");
      });
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "speech.mp3";
      link.click();
    }
  };

  return (
    <div className="tts-container">
      <h1>🔊 Text to Speech</h1>

      <div className="tts-input-section">
        <div className="voice-selection">
          <label htmlFor="voice-select">🎭 Select Voice:</label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="voice-dropdown"
          >
            {voices.map((voice) => (
              <option key={voice} value={voice}>
                {voice.replace("-PlayAI", "")}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="tts-textarea"
        />

        <button
          onClick={handleTextToSpeech}
          disabled={loading || !text.trim()}
          className="tts-button"
        >
          {loading ? "🎵 Converting..." : "🎤 Convert to Speech"}
        </button>
      </div>

      {audioUrl && (
        <div className="tts-audio-section">
          <h3>🎧 Generated Audio:</h3>
          <audio controls src={audioUrl} className="tts-audio" preload="auto">
            Your browser does not support audio playback.
          </audio>

          <div className="tts-actions">
            <button onClick={playAudio} className="tts-play-button">
              ▶️ Play Audio
            </button>
            <button onClick={downloadAudio} className="tts-download-button">
              💾 Download
            </button>
            <button
              onClick={() => setAudioUrl("")}
              className="tts-clear-button"
            >
              🗑️ Clear Audio
            </button>
          </div>

          <div className="debug-info">
            <small>Audio URL: {audioUrl.substring(0, 50)}...</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
