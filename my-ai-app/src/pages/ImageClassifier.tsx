import { useRef, useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import "./ImageClassifier.css";

type Prediction = {
  className: string;
  probability: number;
};

function ImageClassifier() {
  const [result, setResult] = useState<Prediction | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !imgRef.current) return;
    const imgURL = URL.createObjectURL(file);
    imgRef.current.src = imgURL;
    setResult(null);

    // Wait until the image is loaded
    imgRef.current.onload = async () => {
      if (!imgRef.current) return;
      const model = await mobilenet.load();
      const predictions = await model.classify(imgRef.current);
      setResult(predictions[0]); // Top prediction
    };
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <img
        ref={imgRef}
        alt="preview"
        crossOrigin="anonymous"
        style={{ maxWidth: 300, display: "block", marginTop: 16 }}
        loading="eager"
      />
      {result && (
        <div className="prediction-result">
          <h3 className="prediction-title">🎯 AI Prediction</h3>
          <div className="prediction-content">
            <div className="prediction-label">{result.className}</div>
            <div className="confidence-section">
              <span className="confidence-text">Confidence</span>
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${result.probability * 100}%` }}
                ></div>
              </div>
              <span className="confidence-percentage">
                {(result.probability * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageClassifier;
