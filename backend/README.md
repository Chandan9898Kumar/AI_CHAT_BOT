# Backend Server Code Documentation

This document provides a detailed explanation of the backend server that powers the AI Assistant with both text chat and image generation capabilities.

## Import Statements

### `import express from 'express';`
- **What it does:** Imports the Express.js framework
- **Why we use it:** Express is a minimal web framework for Node.js that simplifies creating HTTP servers, handling routes, and middleware
- **How it helps:** Provides easy-to-use methods for creating API endpoints, handling requests/responses, and managing server functionality

### `import cors from 'cors';`
- **What it does:** Imports the CORS (Cross-Origin Resource Sharing) middleware
- **Why we use it:** Browsers block requests from different origins (domains/ports) by default for security
- **How it helps:** Allows your frontend (running on port 5173) to communicate with your backend (running on port 3001) without CORS errors

### `import dotenv from 'dotenv';`
- **What it does:** Imports the dotenv package for environment variable management
- **Why we use it:** Keeps sensitive data like API keys separate from code
- **How it helps:** Loads variables from .env file into process.env, keeping secrets secure and code portable

## Configuration

### `dotenv.config();`
- **What it does:** Executes dotenv to load environment variables from .env file
- **Why we use it:** Activates the environment variable loading process
- **How it helps:** Makes your GROQ_API_KEY and other env variables available throughout the application

### `const app = express();`
- **What it does:** Creates an Express application instance
- **Why we use it:** This is the main server object that handles all HTTP operations
- **How it helps:** Provides the foundation for defining routes, middleware, and server behavior

### `const PORT = process.env.PORT || 3001;`
- **What it does:** Sets the server port, using environment variable or defaulting to 3001
- **Why we use it:** Allows flexible port configuration for different environments (development, production)
- **How it helps:** Makes deployment easier and prevents port conflicts

## Middleware Setup

### `app.use(cors());`
- **What it does:** Applies CORS middleware to all routes
- **Why we use it:** Enables cross-origin requests from your React frontend
- **How it helps:** Prevents "blocked by CORS policy" errors when frontend calls backend APIs

### `app.use(express.json());`
- **What it does:** Adds middleware to parse JSON request bodies
- **Why we use it:** Converts incoming JSON data into JavaScript objects
- **How it helps:** Allows you to access req.body.message in your chat endpoint

## Chat API Endpoint

### `app.post('/api/chat', async (req, res) => {`
- **What it does:** Defines a POST route handler for /api/chat endpoint
- **Why we use it:** Creates the main API endpoint that your frontend calls to send messages
- **How it helps:** Provides a structured way to handle chat requests and responses

### `try {`
- **What it does:** Starts a try-catch block for error handling
- **Why we use it:** Prevents server crashes when errors occur
- **How it helps:** Ensures graceful error handling and proper error responses to frontend

### `const { message } = req.body;`
- **What it does:** Extracts the message property from the request body using destructuring
- **Why we use it:** Gets the user's message sent from the frontend
- **How it helps:** Provides clean access to the user input that needs to be sent to Groq

## Input Validation

### `if (!message) { return res.status(400).json({ error: 'Message required' }); }`
- **What it does:** Validates that a message was provided in the request
- **Why we use it:** Prevents sending empty requests to Groq API
- **How it helps:** Returns clear error message to frontend and saves API calls

### `if (!process.env.GROQ_API_KEY) { return res.json({ response: 'API key not configured...' }); }`
- **What it does:** Checks if Groq API key is configured
- **Why we use it:** Prevents API calls without authentication
- **How it helps:** Provides helpful error message for configuration issues

## Groq API Call

### `const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {`
- **What it does:** Makes HTTP request to Groq's chat completions API
- **Why we use it:** Groq provides fast LLM inference through this endpoint
- **How it helps:** Connects your app to Groq's AI models for generating responses

### `method: 'POST',`
- **What it does:** Specifies HTTP POST method
- **Why we use it:** Chat completions API requires POST for sending data
- **How it helps:** Follows Groq API requirements for proper communication

### Headers Configuration
```javascript
headers: {
  'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
  'Content-Type': 'application/json'
},
```
- **What it does:** Sets required HTTP headers for authentication and content type
- **Why we use it:** Groq API requires Bearer token auth and JSON content type
- **How it helps:** Authenticates your requests and ensures proper data format

### Request Body
```javascript
body: JSON.stringify({
  model: 'llama-3.1-8b-instant',
  messages: [{ role: 'user', content: message }],
  temperature: 0.1,
  max_tokens: 1000
})
```
- **What it does:** Converts request parameters to JSON string
- **Why we use it:** API expects JSON payload with specific structure
- **How it helps:**
  - `model`: Specifies which AI model to use (fast Llama model)
  - `messages`: Formats user input in chat format
  - `temperature`: Controls randomness (0.1 = more focused responses)
  - `max_tokens`: Limits response length to prevent overly long outputs

## Response Processing

### `const data = await response.json();`
- **What it does:** Parses Groq API response from JSON to JavaScript object
- **Why we use it:** Converts API response to usable format
- **How it helps:** Allows access to the AI-generated message content

### Error Checking
```javascript
if (!response.ok) {
  console.error('Groq API error:', data);
  throw new Error(`Groq API error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
}
```
- **What it does:** Checks if Groq API request was successful
- **Why we use it:** Handles API errors gracefully
- **How it helps:** Logs errors for debugging and throws descriptive error messages

### `res.json({ response: data.choices[0].message.content });`
- **What it does:** Sends AI response back to frontend
- **Why we use it:** Completes the request-response cycle
- **How it helps:** Delivers the AI-generated text to your React app for display

## Error Handling

### Catch Block
```javascript
} catch (error) {
  console.error('Chat error:', error.message);
  res.json({ response: 'Sorry, I encountered an error. Please try again.' });
}
```
- **What it does:** Catches any errors and sends user-friendly message
- **Why we use it:** Prevents server crashes and provides graceful error handling
- **How it helps:** Logs errors for debugging while showing friendly message to users

## Server Startup

## Image Generation Endpoint

### `app.post("/api/generate-image", async (req, res) => {`
- **What it does:** Defines a POST route handler for image generation
- **Why we use it:** Provides image generation capability through Hugging Face API
- **How it helps:** Allows frontend to request AI-generated images

### `const { prompt } = req.body;`
- **What it does:** Extracts the image prompt from request body
- **Why we use it:** Gets the user's image description for generation
- **How it helps:** Provides the text input needed for image creation

### Hugging Face API Call
```javascript
const response = await fetch(
  "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      options: { wait_for_model: true },
    }),
  }
);
```
- **What it does:** Makes HTTP request to Hugging Face FLUX.1-dev model
- **Why we use it:** FLUX.1-dev provides high-quality image generation
- **How it helps:** Converts text prompts into photorealistic images

### Image Processing
```javascript
const imageBuffer = await response.arrayBuffer();
const base64Image = Buffer.from(imageBuffer).toString('base64');
const imageUrl = `data:image/jpeg;base64,${base64Image}`;
```
- **What it does:** Converts binary image data to base64 format
- **Why we use it:** Base64 images can be directly displayed in HTML/React
- **How it helps:** Eliminates need for file storage and provides immediate display

### `app.listen(PORT, () => { console.log(\`Server running on port ${PORT}\`); });`
- **What it does:** Starts the Express server on specified port
- **Why we use it:** Makes your API accessible via HTTP requests
- **How it helps:** Activates the server and confirms it's running with a console message

## Architecture Summary

## API Endpoints

### POST /api/chat
**Purpose:** Handle text-based AI conversations
**Request Body:** `{ message: string }`
**Response:** `{ response: string }`
**AI Model:** Groq's Llama 3.1-8b-instant

### POST /api/generate-image
**Purpose:** Generate images from text prompts
**Request Body:** `{ prompt: string }`
**Response:** `{ imageUrl: string }` (base64 encoded image)
**AI Model:** Hugging Face FLUX.1-dev

## Environment Variables Required

```
GROQ_API_KEY=gsk_... (for chat functionality)
HUGGINGFACE_API_KEY=hf_... (for image generation)
PORT=3001 (optional, defaults to 3001)
```

## Architecture Summary

This server creates a robust, error-handled API that:
1. **Securely manages** multiple API keys through environment variables
2. **Validates input** to prevent invalid requests
3. **Handles CORS** to enable frontend-backend communication
4. **Processes JSON** requests and responses
5. **Connects to Groq** for text AI inference
6. **Connects to Hugging Face** for image generation
7. **Converts images** to base64 for easy frontend display
8. **Handles errors** gracefully without crashing
9. **Provides feedback** through console logging and user messages

The result is a production-ready backend that safely connects your React frontend to multiple AI services for both text and image generation.