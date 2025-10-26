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

### Example: "What's the weather in Tokyo and calculate 15 \* 23?"

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
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
    );
    const data = await response.json();
    return `Weather in ${city}: ${data.weather[0].description}, ${Math.round(
      data.main.temp - 273.15
    )}°C`;
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
**Example triggers:** "15 \* 23", "what's 100 / 4", "calculate 2^8"

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

### 🤖 LangChain Agent Creation.

1. const groqAgent = createAgent({})

```js
const groqAgent = createAgent({})

1. What it does: Creates a new LangChain agent instance

2. Why we use it: This is the main function that combines an LLM with tools to create an intelligent agent

3. How it works: Returns an agent object that can process messages and decide which tools to use
```

2. model: new ChatGroq({})

```js
model: new ChatGroq({})

1. What it does: Creates a new Groq chat model instance

2. Why we use it: Groq provides fast LLM inference - this is the "brain" of our agent

3. How it works: Connects to Groq's API to process natural language and make decisions

```

3. apiKey: process.env.GROQ_API_KEY

```js
apiKey: process.env.GROQ_API_KEY

1. What it does: Provides authentication credentials for Groq API

2. Why we use it: Required to access Groq's paid API service

3. How it works: Reads the API key from environment variables for security
```

4. model: "llama-3.1-8b-instant"

```js
model: "llama-3.1-8b-instant"

1. What it does: Specifies which AI model to use

2. Why we use it: Llama-3.1-8b-instant is fast and good for tool calling

3. How it works: Tells Groq which specific model variant to run our requests on
```

5.  temperature: 0

```js
temperature: 0

1. What it does: Controls randomness/creativity of responses (commented out)

2. Why we use it: Temperature 0 = consistent, predictable responses

3. How it works: Lower values = more focused, higher values = more creative
```

6. tools: [weatherTool, calculatorTool, searchTool],

```js
tools: [weatherTool, calculatorTool, searchTool],


1. What it does: Provides the agent with available tools/functions

2. Why we use it: Gives the agent superpowers - ability to get weather, calculate, search

3. How it works: Agent analyzes user input and decides which tools to call based on descriptions
```

7. maxIterations: 1,

```js
maxIterations: 1

1. What it does: Limits how many times the agent can call tools in one conversation

2. Why we use it: Prevents infinite loops and excessive API calls

3. How it works: After 1 tool call, agent must provide final response


### Example without limit:
  User: "Weather in Tokyo"
  Iteration 1: Calls weatherTool
  Iteration 2: Calls weatherTool again (unnecessary)
  Iteration 3: Calls calculatorTool (wrong tool)
  ... continues forever


### With maxIterations: 1:
  User: "Weather in Tokyo"
  Iteration 1: Calls weatherTool → Returns result → Done ✅


```

8. systemMessage

```js
systemMessage:'type your message'

1. What it does: Gives the agent personality and instructions

2. Why we use it: Guides agent behavior and prevents misuse of tools

3. How it works: This message is prepended to every conversation to set context
```

### 🔄 Complete Flow Example

User asks: "What's the weather in Tokyo?"

```js
1. createAgent() → Creates agent with Groq model + tools
2. Agent receives: "What's the weather in Tokyo?"
3. Agent thinks: "This needs weatherTool based on description"
4. maxIterations: 1 → Agent can make 1 tool call
5. Calls weatherTool({ city: "Tokyo" })
6. Tool returns: "Weather in Tokyo: sunny, 25°C"
7. systemMessage guides: "Trust the tool result"
8. Agent responds: "The weather in Tokyo is sunny, 25°C"


```

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

### 4. Smart Context Understanding

```js
// LLM understands context and synonyms:
"temperature in Paris" → weatherTool (temperature = weather)
"what's 10 times 5" → calculatorTool (times = multiplication)
"look up JavaScript" → searchTool (look up = search)


```

📝 Real Examples:

1. `Weather Query`

```js
// User Input
"What's the weather in Paris?"

// Agent Decision Process
1. LLM sees: "weather in Paris"
2. Matches description: "Get real weather for any city"
3. Extracts parameter: { city: "Paris" }
4. Calls: weatherTool({ city: "Paris" })
5. Returns: "Weather in Paris: cloudy, 18°C"


```

2. `Math Query`

```js
// User Input
"Calculate 25 * 4 + 10"

// Agent Decision Process
1. LLM sees: "Calculate 25 * 4 + 10"
2. Matches description: "Calculate math expressions"
3. Extracts parameter: { expression: "25 * 4 + 10" }
4. Calls: calculatorTool({ expression: "25 * 4 + 10" })
5. Returns: "Result: 110"

```

3. `Search Query`

```js
// User Input
"Search for React tutorials"

// Agent Decision Process
1. LLM sees: "Search for React tutorials"
2. Matches description: "Search the web for information"
3. Extracts parameter: { query: "React tutorials" }
4. Calls: searchTool({ query: "React tutorials" })
5. Returns: "Search results for 'React tutorials': Found relevant information..."

```

4. `Multiple Tools`

```js
// User Input
"What's the weather in London and search for best restaurants there?"

// Agent Decision Process
1. LLM identifies two tasks:
   - Weather query → weatherTool
   - Search query → searchTool
2. Calls both tools:
   - weatherTool({ city: "London" })
   - searchTool({ query: "best restaurants London" })
3. Combines results in natural language


```

### 🚫 When Agent Doesn't Use Tools.

```js
// User Input
"Hello, how are you?"

// Agent Decision Process
1. LLM sees: "Hello, how are you?"
2. No match with any tool descriptions
3. Responds directly: "Hello! I'm doing well, thank you for asking!"
4. No tools called

```

### 🔧 Behind the Scenes Code Flow.

```js
// This is what happens internally when you call:
const result = await groqAgent.invoke({
  messages: [{ role: "user", content: "Weather in Tokyo?" }]
});

// LangChain does:
1. Sends user message + tool descriptions to LLM
2. LLM decides to use weatherTool
3. LLM generates: { tool_calls: [{ name: "get_weather", parameters: { city: "Tokyo" }}]}
4. LangChain executes: weatherTool({ city: "Tokyo" })
5. Tool returns: "Weather in Tokyo: sunny, 22°C"
6. LLM creates final response using tool result
7. Returns complete conversation

```

### 🎯 Key Takeaway.

`The agent is smart because:`

1. LLM reads tool descriptions and understands what each tool does
2. LLM analyzes user input to match intent with available tools
3. LLM extracts parameters using the tool schemas
4. LLM combines tool results into natural language responses

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
console.log("Weather API response:", data);

// In agent endpoint
console.log("Agent result:", result);
```

Check server console for detailed error messages and API responses.

## 🚀 Deployment

For production deployment:

1. **Set environment variables** in your hosting platform
2. **Update CORS settings** for your frontend domain
3. **Add rate limiting** for API endpoints
4. **Implement authentication** if needed
5. **Add request logging** for monitoring

### Imporatant : calling api in server.js decsiption.

So, here we are directly calling groq api. no set-up is required.

> Explanation :

🚀 What is Groq?
Groq is like a super-fast AI service that runs large language models (like ChatGPT) but much faster.

`Think of it like:`

1. OpenAI/ChatGPT = Smart but slow restaurant chef

2. Groq = Smart AND lightning-fast chef (same quality, 10x speed)

```js
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.json({
        response:
          "API key not configured. Please set GROQ_API_KEY in .env file.",
      });
    }

    // when we call this api :
    // What happens: Makes HTTP request to Groq's servers
    // Why it works: Groq provides a REST API endpoint that accepts HTTP requests
    // No setup needed: Just need internet connection + API key

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST", // Sending data to server
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, //  Proves you're allowed to use the service
          "Content-Type": "application/json", // Tells server we're sending JSON data
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // model = Which AI brain to use. ← This is Meta's Llama model!
          messages: [{ role: "user", content: message }], // messages = Your question
          temperature: 0.1, // temperature = How creative to be
          max_tokens: 1000, // max_tokens = Maximum response length
        }),
      }
    );


});
```

### 🧠 The Real Story: Who Makes What?

`Model Creators (The Brains):`

1. Meta → Creates Llama models (Llama-3.1-8b-instant)
2. Google → Creates Gemma models
3. Mistral AI → Creates Mixtral models
4. OpenAI → Creates GPT models

`Groq (The Speed Service):`

1. Takes existing models (like Llama from Meta)
2. Runs them super fast on custom chips
3. Provides API access to these models

### Conclusion : What Happens Behind the Scenes:

1. Your Request Arrives at Groq.

```js
Your API call → Groq's servers`
```

2. Groq Loads Meta's Llama Model. This Meta's Llama Model IS Deployed on Groq's Servers.

```js
Groq: "User wants llama-3.1-8b-instant";
Groq: "Loading Meta's Llama model from our servers...";

### INFO:
Groq Downloads & Stores Models :
  1. Meta releases Llama → Open Source
      ↓
  2. Groq downloads Llama model files (8GB+)
      ↓
  3. Groq stores Llama on their own servers
      ↓
  4. Groq optimizes Llama for their custom chips

> So Before Your Request,  Groq has ALREADY done this:

1. Downloaded Meta's Llama model → Stored on Groq servers
2. Loaded Llama into server memory → Ready to use
3. Optimized for their chips → Super fast processing.

> When You Make API Call:
Groq's Process:
1. Your request arrives → Groq's load balancer
2. "User wants llama-3.1-8b-instant" → Route to Server #47
3. Server #47 already has Llama loaded → No download needed!
4. Process message through Llama → Generate response
5. Send response back → Takes ~100ms total
```

3. Groq Runs the Model on Custom Chips.

```js
Your message → Groq's custom AI chips → Meta's Llama processes it → Response

```

4. Groq Returns the Answer.

```js
Llama's response → Groq formats it → Sends back to you

```

### 🎯 Final Answer

> When you call https://api.groq.com/openai/v1/chat/completions:

```js
. Groq receives your request

. Groq routes to their server that has Llama pre-loaded.

. Groq runs Llama on their custom chips

. Llama (Meta's AI) generates the response

. Groq sends Llama's response back to you

. So the actual "thinking" is done by Meta's Llama model, but Groq makes it lightning fast! ⚡
```

## 📝 License

MIT License - feel free to use this code for your projects!
