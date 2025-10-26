import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as z from "zod";
import { createAgent, tool } from "langchain";
import { ChatGroq } from "@langchain/groq";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create tools
const weatherTool = tool(
  async ({ city }) => {
    // Real weather API call
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
      );

      if (response.status !== 200) {
        throw new Error(response.message || "Something went wrong.");
      }
      const data = await response.json();
      console.log(data, "data wather api");
      return `Weather in ${city}: ${data.weather[0].description}, ${Math.round(
        data.main.temp - 273.15
      )}°C`;
    } catch (error) {
      return error;
    }
  },
  {
    name: "get_weather",
    description: "Get real weather for any city",
    schema: z.object({ city: z.string() }),
  }
);

const calculatorTool = tool(
  ({ expression }) => {
    try {
      return `Result: ${eval(expression)}`; // ← This line does the actual calculation. eval() executes the math
    } catch {
      return "Invalid calculation";
    }
  },
  {
    name: "calculator",
    description: "Calculate math expressions",
    schema: z.object({ expression: z.string() }),
  }
);

const searchTool = tool(
  async ({ query }) => {
    // Mock search - replace with real search API
    return `Search results for "${query}": Found relevant information about ${query}`;
  },
  {
    name: "web_search",
    description: "Search the web for information",
    schema: z.object({ query: z.string() }),
  }
);

// Create Groq-powered agent using langchain.
const groqAgent = createAgent({
  model: new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    // temperature: 0, // More deterministic
  }),
  tools: [weatherTool, calculatorTool, searchTool],
  maxIterations: 1, // Limit tool call iterations. Limit Tool Calls
  systemMessage:
    "You are a helpful assistant. Use tools only when necessary and trust their results. Don't call multiple tools for simple requests.",
});

app.use(cors());
app.use(express.json());

// Here we are doing Direct Groq API Call (/api/chat)
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

// Enhanced chat with tools :LangChain Agent. For example :
// What happens:
// User asks: "Weather in Tokyo?"
// Agent thinks: "I need the weather tool for this"
// Calls weatherTool: Fetches real weather data
// Agent responds: "Tokyo weather: sunny, 22°C"
app.post("/api/chat-enhanced", async (req, res) => {
  try {
    const { message } = req.body;

    const result = await groqAgent.invoke({
      messages: [{ role: "user", content: message }],
    });

    // Extract tool results
    const toolMessages = result.messages.filter(
      (msg) => msg.constructor.name === "ToolMessage"
    );

    // If we have tool results, use them directly
    let finalResponse = result.messages[result.messages.length - 1].content;

    if (toolMessages.length > 0) {
      // Use the actual tool result instead of agent's response
      finalResponse = toolMessages.map((msg) => msg.content).join(". ");
    }

    const toolsUsed = [];
    result.messages.forEach((msg) => {
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        msg.tool_calls.forEach((toolCall) => {
          toolsUsed.push(toolCall.name);
        });
      }
    });

    res.json({
      response: finalResponse, // Use tool result directly
      tools_used: Array.from(new Set(toolsUsed)),
      tool_results: toolMessages.map((msg) => ({
        tool_name: msg.name,
        content: msg.content,
        id: msg.id,
      })),
    });
  } catch (error) {
    console.error("Enhanced chat error:", error);
    res.json({ response: "Error occurred" });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
