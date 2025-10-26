import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as z from "zod";
import { createAgent, tool } from "langchain";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const getWeather = tool(({ city }) => `It's always sunny in ${city}!`, {
  name: "get_weather",
  description: "Get the weather for a given city",
  schema: z.object({
    city: z.string(),
  }),
});

const agent = createAgent({
  model: "anthropic:claude-3-5-sonnet-20241022",
  tools: [getWeather],
});

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.json({
        response:
          "API key not configured. Please set GROQ_API_KEY in .env file.",
      });
    }

    if (!process.env.HUGGINGFACEHUB_API_KEY) {
      return res.json({
        response:
          "Hugging Face API key not configured. Please set HUGGINGFACE_API_KEY in .env file.",
      });
    }

    // Check if user is requesting an image
    const imageKeywords = [
      "image",
      "picture",
      "photo",
      "generate image",
      "create image",
      "show me",
    ];
    const isImageRequest = imageKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );

    if (isImageRequest) {
      return res.json({
        response:
          "I can help you with text-based responses, but I cannot generate or display images. For free image generation, try:\n\n• Hugging Face Spaces (Stable Diffusion)\n• Craiyon (formerly DALL-E mini)\n• Leonardo.ai (free tier)\n• Bing Image Creator (free with Microsoft account)\n• Google Images search for existing images\n\nIs there anything else I can help you with?",
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: message }],
          temperature: 0.1,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      console.error("Groq API error:", data);
      throw new Error(
        `Groq API error: ${response.status} - ${
          data.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();

    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.json({ response: "Sorry, I encountered an error. Please try again." });
  }
});

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    if (!process.env.HUGGINGFACEHUB_API_KEY) {
      return res.json({ error: "Hugging Face API key not configured" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACEHUB_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API Error: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    res.json({ imageUrl });
  } catch (error) {
    res.json({ error: error.message || "Error generating image" });
  }
});

app.post("/api/agent", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({ response: "Anthropic API key required" });
    }

    const result = await agent.invoke({
      messages: [{ role: "user", content: message }],
    });

    res.json({ response: result.messages[result.messages.length - 1].content });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({ error: "Agent error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
