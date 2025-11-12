// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { body, validationResult } from "express-validator";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post(
  "/api/chat-gemini",
  [
    // Validation middleware
    body("message")
      .exists()
      .withMessage("Message is required")
      .isString()
      .withMessage("Message must be a string")
      .trim()
      .notEmpty()
      .withMessage("Message cannot be empty")
      .isLength({ max: 10000 })
      .withMessage("Message is too long"),
  ],
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { message } = req.body;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
      });

      res.status(200).json({
        success: true,
        response: response.text,
      });
    } catch (error) {
      console.error("Error in /api/chat-gemini:", error);

      res.status(500).json({
        success: false,
        error: "Failed to generate response",
      });
    }
  }
);
// Text-to-Image generation endpoint
app.post(
  "/api/generate-image",
  [
    body("prompt")
      .exists()
      .withMessage("Prompt is required")
      .isString()
      .withMessage("Prompt must be a string")
      .trim()
      .notEmpty()
      .withMessage("Prompt cannot be empty")
      .isLength({ max: 1000 })
      .withMessage("Prompt is too long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { prompt } = req.body;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });

      // Find the image data in the response
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;

          res.status(200).json({
            success: true,
            imageData: imageData, // Base64 encoded image
            message: "Image generated successfully",
          });
          return;
        }
      }

      // If no image found in response
      res.status(400).json({
        success: false,
        error: "No image generated",
      });
    } catch (error) {
      console.error("Error in /api/generate-image:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate image",
      });
    }
  }
);


app.post("/api/v1/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body; // Get the prompt from the frontend's request

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    console.log(`Generating image for prompt: "${prompt}"`);

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "1:1",
      },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;

    // Send the image data back to the frontend.
    res.json({ image: base64ImageBytes });
  } catch (error) {
    console.error("Error in /api/generate-image:", error);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

app.listen(PORT, () => [console.log(`Server is running on port ${PORT}`)]);
