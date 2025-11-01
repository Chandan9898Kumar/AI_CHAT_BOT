// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
import { body, validationResult } from "express-validator";
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
app.listen(PORT, () => [console.log(`Server is running on port ${PORT}`)]);
