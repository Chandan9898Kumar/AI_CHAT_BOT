import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/api/chat-gemini", async (req, res) => {
  const { message } = req.body;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "what 5+5-10*100",
  });

  res.json({ response: response.text });
});

app.listen(PORT, () => [console.log(`Server is running on port ${PORT}`)]);
