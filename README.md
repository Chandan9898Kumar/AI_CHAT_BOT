# 🤖 AI Assistant

A modern full-stack AI chat application with text generation and image creation capabilities. Powered by Groq's lightning-fast LLM inference and Hugging Face's FLUX image generation model.

## Features

### 💬 Chat Capabilities
- Real-time AI conversations powered by Groq's Llama 3.1 model
- Intelligent response generation for any topic
- Copy AI responses with one-click
- Message history with timestamps

### 🎨 Image Generation
- AI-powered image creation using Hugging Face FLUX.1-dev model
- Automatic keyword detection for image requests
- High-quality photorealistic image generation
- Seamless integration within chat interface

### 🖥️ Modern UI/UX
- Dark theme interface inspired by Perplexity
- Smooth animations and typing indicators
- Responsive design for all devices
- Welcome screen with gradient text effects
- Message bubbles with avatars and hover effects

### 🔧 Technical Features
- TypeScript support for type safety
- Environment-based configuration
- Secure API key management
- Error handling and graceful fallbacks
- CORS-enabled backend

## Setup Instructions

### 1. Get API Keys

**Groq API Key (for chat):**
1. Go to [Groq Console](https://console.groq.com/)
2. Sign up/Login
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

**Hugging Face API Key (for image generation):**
1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up/Login
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token

### 2. Backend Setup
```bash
cd backend
npm install
```

Edit `.env` file and add your API keys:
```
GROQ_API_KEY=your_actual_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
PORT=3001
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd my-ai-app
npm install
npm run dev
```

### 4. Usage

**Text Chat:**
1. Open http://localhost:5173 (Vite dev server)
2. Type any question or request
3. Press Enter or click Send
4. Copy AI responses using the copy button

**Image Generation:**
1. Use keywords like "image", "picture", "photo", "generate image", "create image", or "draw"
2. Example: "Generate an image of a sunset over mountains"
3. AI will automatically detect and create the image
4. Images appear directly in the chat interface

## Example Conversations

**Text Chat:**
- "Explain how React hooks work"
- "Write a Python function to sort a list"
- "Help me debug this JavaScript error"
- "What are the best practices for API design?"

**Image Generation:**
- "Generate an image of a futuristic city"
- "Create a picture of a cute robot"
- "Draw a landscape with mountains and lakes"
- "Show me an image of a modern office space"

## Tech Stack

**Backend:**
- Node.js + Express
- Groq API for LLM inference (Llama 3.1-8b-instant)
- Hugging Face API for image generation (FLUX.1-dev)
- CORS enabled
- Environment-based configuration
- Base64 image encoding for frontend display

**Frontend:**
- React 18 + TypeScript
- Vite for fast development
- Modern dark theme UI inspired by Perplexity
- Responsive design with CSS Grid/Flexbox
- Image display with hover effects
- Smooth animations and transitions

## API Endpoints

- `POST /api/chat` - Send message to AI and get text response
- `POST /api/generate-image` - Generate image from text prompt
- Server runs on port 3001 by default

## Troubleshooting

1. **Backend not starting:** Check if your API keys are valid and properly set in .env
2. **No AI response:** Verify Groq API key has proper permissions
3. **Image generation fails:** Check Hugging Face API key and model availability
4. **CORS errors:** Ensure backend is running on port 3001
5. **Frontend not loading:** Make sure you're accessing http://localhost:5173
6. **Images not displaying:** Check browser console for errors and network requests

## Environment Variables Required

```
GROQ_API_KEY=gsk_... (for chat functionality)
HUGGINGFACE_API_KEY=hf_... (for image generation)
PORT=3001 (optional, defaults to 3001)
```

## License

MIT License - feel free to use and modify!