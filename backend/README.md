# AI Code Generator Backend

A comprehensive Node.js backend that provides multiple AI capabilities including text chat, enhanced agent-based interactions, and image generation.

## 🚀 Features

- **Direct Chat API**: Basic text conversations using Groq's fast LLM
- **Enhanced Agent Chat**: LangChain-powered agent with tools (weather, calculator, search)
- **Image Generation**: AI-powered image creation using Hugging Face models
- **CORS Support**: Frontend-backend communication enabled
- **Error Handling**: Robust error management and user-friendly responses

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API Keys:
  - Groq API Key (free from https://console.groq.com/)
  - OpenWeather API Key (free from https://openweathermap.org/api)
  - Hugging Face API Key (free from https://huggingface.co/settings/tokens)

## 🛠️ Installation

1. **Clone and navigate to backend:**
```bash
cd ai-code-generator/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
GROQ_API_KEY=gsk_your_groq_key_here
WEATHER_API_KEY=your_openweather_key_here
HUGGINGFACEHUB_API_KEY=hf_your_huggingface_key_here
PORT=3001
```

4. **Start the server:**
```bash
npm start
```

## 🔧 API Endpoints

### 1. Direct Chat API
**Endpoint:** `POST /api/chat`
**Purpose:** Basic AI conversations without tools

```javascript
// Request
{
  "message": "What's the weather in Tokyo?"
}

// Response
{
  "response": "I don't have real-time weather access, but you can check weather.com..."
}
```

### 2. Enhanced Agent Chat
**Endpoint:** `POST /api/chat-enhanced`
**Purpose:** AI agent with tools (weather, calculator, search)

```javascript
// Request
{
  "message": "What's the weather in Tokyo and calculate 15 * 23?"
}

// Response
{
  "response": "Weather in Tokyo: clear sky, 22°C and 15 * 23 = 345",
  "tools_used": ["get_weather", "calculator"]
}
```

### 3. Image Generation
**Endpoint:** `POST /api/generate-image`
**Purpose:** Generate images from text prompts

```javascript
// Request
{
  "prompt": "A beautiful sunset over mountains"
}

// Response
{
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

## 🤖 How LangChain Agent Works

### Agent Decision Process

The LangChain agent follows this decision-making process:

1. **Receives user input**
2. **Analyzes the request** to determine what tools are needed
3. **Calls appropriate tools** in sequence or parallel
4. **Combines results** from all tools
5. **Generates final response** using the LLM + tool outputs

### Example: "What's the weather in Tokyo and calculate 15 * 23?"

```
Step 1: User Input Analysis
├── Agent identifies two tasks:
│   ├── Weather query for Tokyo
│   └── Mathematical calculation

Step 2: Tool Selection
├── Selects weatherTool for "Tokyo weather"
├── Selects calculatorTool for "15 * 23"

Step 3: Tool Execution
├── weatherTool.invoke({ city: "Tokyo" })
│   └── Calls OpenWeather API
│   └── Returns: "Weather in Tokyo: clear sky, 22°C"
├── calculatorTool.invoke({ expression: "15 * 23" })
│   └── Evaluates expression
│   └── Returns: "Result: 345"

Step 4: Response Generation
└── Agent combines tool outputs with natural language
    └── Final: "Weather in Tokyo: clear sky, 22°C and 15 * 23 = 345"
```

## 🛠️ Available Tools

### 1. Weather Tool
```javascript
const weatherTool = tool(
  async ({ city }) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`);
    const data = await response.json();
    return `Weather in ${city}: ${data.weather[0].description}, ${Math.round(data.main.temp - 273.15)}°C`;
  },
  {
    name: "get_weather",
    description: "Get real weather for any city",
    schema: z.object({ city: z.string() }),
  }
);
```

**What it does:** Fetches real-time weather data from OpenWeather API
**When agent uses it:** User asks about weather, temperature, or climate
**Example triggers:** "weather in Paris", "is it raining in London", "temperature in New York"

### 2. Calculator Tool
```javascript
const calculatorTool = tool(
  ({ expression }) => {
    try {
      return `Result: ${eval(expression)}`;
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
```

**What it does:** Evaluates mathematical expressions
**When agent uses it:** User asks for calculations, math problems
**Example triggers:** "15 * 23", "what's 100 / 4", "calculate 2^8"

### 3. Search Tool
```javascript
const searchTool = tool(
  async ({ query }) => {
    return `Search results for "${query}": Found relevant information about ${query}`;
  },
  {
    name: "web_search",
    description: "Search the web for information",
    schema: z.object({ query: z.string() }),
  }
);
```

**What it does:** Mock search functionality (replace with real search API)
**When agent uses it:** User asks for general information, facts
**Example triggers:** "search for React tutorials", "find information about AI"

## 🧠 Agent vs Direct API Comparison

### Direct Groq API (`/api/chat`)
```
User: "What's the weather in Tokyo and calculate 15 * 23?"
│
├── Sends to Groq LLM directly
├── LLM has no tools or real-time data
├── Response: "I don't have real-time weather access, but 15 * 23 = 345"
└── Limited to training data knowledge
```

### LangChain Agent (`/api/chat-enhanced`)
```
User: "What's the weather in Tokyo and calculate 15 * 23?"
│
├── Agent analyzes request
├── Identifies need for weather tool + calculator tool
├── Calls weatherTool({ city: "Tokyo" })
│   └── Returns: "Weather in Tokyo: clear sky, 22°C"
├── Calls calculatorTool({ expression: "15 * 23" })
│   └── Returns: "Result: 345"
├── Agent combines results with LLM
└── Response: "Weather in Tokyo: clear sky, 22°C and 15 * 23 = 345"
```

## 🔄 How Agent Decides Which Tools to Use

The agent uses the tool descriptions and schemas to make decisions:

### 1. Natural Language Processing
```javascript
// Agent analyzes user input for keywords and intent
"weather in Tokyo" → matches "Get real weather for any city" → uses weatherTool
"calculate 15 * 23" → matches "Calculate math expressions" → uses calculatorTool
"search for React" → matches "Search the web for information" → uses searchTool
```

### 2. Schema Matching
```javascript
// Agent extracts parameters based on tool schemas
weatherTool schema: { city: z.string() }
User: "weather in Tokyo" → extracts { city: "Tokyo" }

calculatorTool schema: { expression: z.string() }
User: "calculate 15 * 23" → extracts { expression: "15 * 23" }
```

### 3. Multi-Tool Coordination
```javascript
// Agent can use multiple tools for complex requests
User: "What's the weather in Paris and calculate the tip for a $50 meal at 20%?"

Agent Decision Process:
├── Tool 1: weatherTool({ city: "Paris" })
├── Tool 2: calculatorTool({ expression: "50 * 0.20" })
└── Combines: "Weather in Paris: sunny, 18°C. Tip for $50 at 20% is $10"
```

## 🏗️ Architecture Overview

```
Frontend (React)
    ↓ HTTP Request
Backend (Express.js)
    ├── /api/chat → Direct Groq API
    ├── /api/chat-enhanced → LangChain Agent → Tools
    │   ├── weatherTool → OpenWeather API
    │   ├── calculatorTool → JavaScript eval()
    │   └── searchTool → Mock/Real Search API
    └── /api/generate-image → Hugging Face API
```

## 🚦 Error Handling

The server includes comprehensive error handling:

- **API Key Validation**: Checks for required environment variables
- **Input Validation**: Validates request body structure
- **API Error Handling**: Manages external API failures gracefully
- **Tool Error Handling**: Catches and handles tool execution errors
- **User-Friendly Messages**: Returns helpful error messages to frontend

## 🔧 Environment Variables

```bash
# Required for basic chat functionality
GROQ_API_KEY=gsk_your_groq_key_here

# Required for weather tool
WEATHER_API_KEY=your_openweather_key_here

# Required for image generation
HUGGINGFACEHUB_API_KEY=hf_your_huggingface_key_here

# Optional - defaults to 3001
PORT=3001
```

## 🚀 Getting API Keys

### 1. Groq API Key (Free)
1. Visit https://console.groq.com/
2. Sign up for free account
3. Navigate to API Keys section
4. Create new API key
5. Copy key (starts with `gsk_`)

### 2. OpenWeather API Key (Free)
1. Visit https://openweathermap.org/api
2. Sign up for free account
3. Go to API keys section
4. Generate new key
5. Copy the key

### 3. Hugging Face API Key (Free)
1. Visit https://huggingface.co/settings/tokens
2. Sign up for free account
3. Create new token
4. Copy token (starts with `hf_`)

## 📊 Performance & Limitations

### Groq API
- **Speed**: Very fast inference (~100ms response time)
- **Rate Limits**: Generous free tier
- **Models**: Llama 3.1, Mixtral, Gemma

### OpenWeather API
- **Rate Limits**: 1000 calls/day (free tier)
- **Data**: Real-time weather for 200,000+ cities
- **Latency**: ~200-500ms per request

### Hugging Face API
- **Rate Limits**: Varies by model
- **Cold Start**: First request may take 10-20 seconds
- **Image Quality**: High-quality FLUX.1-dev model

## 🔍 Debugging

Enable detailed logging by adding console.log statements:

```javascript
// In weatherTool
console.log('Weather API response:', data);

// In agent endpoint
console.log('Agent result:', result);
```

Check server console for detailed error messages and API responses.

## 🚀 Deployment

For production deployment:

1. **Set environment variables** in your hosting platform
2. **Update CORS settings** for your frontend domain
3. **Add rate limiting** for API endpoints
4. **Implement authentication** if needed
5. **Add request logging** for monitoring

## 📝 License

MIT License - feel free to use this code for your projects!