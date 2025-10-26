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

/**

NOTE :
 TensorFlow is a machine learning and deep learning framework developed by Google.
 TensorFlow is used to build and train models like GPT and Gemini,


 Also in our code : we did not train any model 
  The training is not happening because you are using a pre-trained MobileNet model provided by TensorFlow.js.
  This model has already been trained on millions of images and knows how to classify them into thousands of categories.
 
  . When we upload an image, our app is just using this trained model to classify the image (called inference or prediction).
  . Your app does not perform the training process, which requires a lot of data and computational power.
  . Training means showing many examples to a model and adjusting its internal parameters so it learns to recognize patterns.
  . Since training is expensive and complex, people often use pre-trained models like MobileNet and apply them directly to new images for instant classification.



When Do You Train?
  You train or fine-tune a model if:

  . You want a model to learn new categories or data that the pre-trained model doesn't cover.

  . You want to improve accuracy for a specific task or dataset.

  . This requires labeled data and heavy computation, usually done offline or on powerful servers—not in your React frontend app.
  
  */
