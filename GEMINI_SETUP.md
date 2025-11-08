# 🤖 Using Google Gemini Instead of OpenAI

## Why Gemini?

✅ **Free Tier**: 60 requests per minute (generous!)
✅ **Fast**: Gemini 1.5 Flash is optimized for speed
✅ **Cost-Effective**: Much cheaper than GPT-4
✅ **Multilingual**: Excellent Hindi support
✅ **No Credit Card**: Free tier doesn't require payment

---

## 🚀 Quick Setup

### Step 1: Get Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click **"Get API Key"** or **"Create API Key"**
3. Select or create a Google Cloud project
4. Copy your API key (starts with `AIza...`)

**That's it! No credit card needed for free tier.**

### Step 2: Install Gemini SDK

```powershell
cd backend
npm install @google/generative-ai
```

### Step 3: Update Environment Variables

Edit `backend/.env`:

```env
# Google Gemini API Key (instead of OpenAI)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ElevenLabs for voice (still needed)
ELEVENLABS_API_KEY=your-elevenlabs-key-here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Step 4: Restart Backend

```powershell
cd backend
npm run dev
```

**Done! Your app now uses Gemini instead of OpenAI.**

---

## 📊 Gemini vs OpenAI Comparison

| Feature | Gemini 1.5 Flash | GPT-4o-mini |
|---------|------------------|-------------|
| **Free Tier** | 60 req/min | No free tier |
| **Cost (1M tokens)** | $0.075 | $0.150 |
| **Speed** | Very Fast | Fast |
| **Hindi Support** | Excellent | Good |
| **Context Window** | 1M tokens | 128K tokens |
| **Setup** | No credit card | Credit card required |

---

## 🎯 What Changed?

### Files Modified:

1. ✅ **`backend/services/geminiService.js`** - NEW
   - Gemini API wrapper
   - OpenAI-compatible format
   - Error handling

2. ✅ **`backend/services/conversationService.js`** - UPDATED
   - Uses Gemini instead of OpenAI
   - Same functionality, different backend

3. ✅ **`backend/package.json`** - UPDATED
   - Added `@google/generative-ai` package
   - Removed `openai` package (optional)

---

## 🧪 Test Gemini Integration

### Test 1: Check API Connection

Create `backend/test-gemini.js`:

```javascript
import geminiService from './services/geminiService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
  console.log('🧪 Testing Gemini API Connection...\n');
  
  const result = await geminiService.testConnection();
  
  if (result.success) {
    console.log('✅ Success!');
    console.log('Response:', result.response);
  } else {
    console.log('❌ Failed!');
    console.log('Error:', result.error);
  }
}

testGemini();
```

Run test:
```powershell
node backend/test-gemini.js
```

### Test 2: Test Conversation

```powershell
# Start backend
cd backend
npm run dev

# In another terminal, test with curl
curl -X POST http://localhost:3001/api/chat/message ^
  -H "Content-Type: application/json" ^
  -d "{\"customerId\":\"CUST001\",\"message\":\"Kya update hai?\"}"
```

---

## 💰 Pricing Comparison

### Gemini Pricing

**Free Tier:**
- 60 requests per minute
- 1,500 requests per day
- Perfect for development and small deployments

**Paid Tier (if needed):**
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens

**Example Cost:**
- 100 conversations/day
- ~500 tokens per conversation
- Monthly cost: **~$1.13**

### OpenAI Pricing (for comparison)

**GPT-4o-mini:**
- Input: $0.150 per 1M tokens
- Output: $0.600 per 1M tokens

**Example Cost:**
- 100 conversations/day
- ~500 tokens per conversation
- Monthly cost: **~$2.25**

**Savings with Gemini: ~50%**

---

## 🔧 Advanced Configuration

### Using Gemini 1.5 Pro (More Powerful)

Edit `backend/services/geminiService.js`:

```javascript
this.model = this.genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',  // Changed from 'gemini-1.5-flash'
  generationConfig: {
    temperature: 0.8,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 300,
  }
});
```

**When to use Pro:**
- Complex reasoning needed
- More nuanced responses
- Better context understanding

**Cost:** $3.50 per 1M tokens (still cheaper than GPT-4)

### Adjust Response Style

Edit generation config in `geminiService.js`:

```javascript
generationConfig: {
  temperature: 0.9,      // Higher = more creative (0.0-1.0)
  topP: 0.95,           // Nucleus sampling (0.0-1.0)
  topK: 40,             // Top-k sampling (1-100)
  maxOutputTokens: 500, // Longer responses
}
```

---

## 🎨 Response Quality Tips

### 1. Better Prompts for Hinglish

Gemini works great with Hinglish! Add to system prompt:

```javascript
"You are a friendly AI assistant speaking natural Hinglish (mix of Hindi and English). 
Use casual, conversational tone. Mix Hindi and English naturally like Indians speak."
```

### 2. Consistent Personality

Gemini maintains personality well. Define clearly:

```javascript
"Your name is Priya. You're warm, helpful, and speak like a friendly neighbor. 
Use 'ji' respectfully, ask about chai, and keep conversations natural."
```

### 3. Context Awareness

Gemini has 1M token context window! You can include:
- Full conversation history
- Customer details
- Construction updates
- Past interactions

---

## 🐛 Troubleshooting

### Error: "API key not valid"

**Solution:**
1. Check `.env` file has correct key
2. Key should start with `AIza`
3. No spaces before/after key
4. Restart backend server

### Error: "Quota exceeded"

**Solution:**
- Free tier: 60 requests/minute
- Wait 1 minute and try again
- Or upgrade to paid tier

### Error: "Model not found"

**Solution:**
- Check model name: `gemini-1.5-flash` or `gemini-1.5-pro`
- Update SDK: `npm install @google/generative-ai@latest`

### Slow Responses

**Solution:**
- Use `gemini-1.5-flash` (faster)
- Reduce `maxOutputTokens`
- Check internet connection

---

## 📈 Performance Optimization

### 1. Cache System Prompts

```javascript
// Cache the system prompt for faster responses
const cachedPrompt = await this.model.cacheContent({
  contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
  ttlSeconds: 3600 // Cache for 1 hour
});
```

### 2. Parallel Requests

```javascript
// Process multiple customers simultaneously
const responses = await Promise.all(
  customers.map(c => geminiService.createChatCompletion(messages))
);
```

### 3. Streaming Responses

```javascript
// Stream responses for faster perceived performance
const result = await this.model.generateContentStream(prompt);
for await (const chunk of result.stream) {
  const text = chunk.text();
  // Send chunk to frontend
}
```

---

## 🔒 Security Best Practices

### 1. Protect API Key

```javascript
// ✅ Good - Use environment variable
const apiKey = process.env.GEMINI_API_KEY;

// ❌ Bad - Hardcoded key
const apiKey = 'AIzaSy...'; // Never do this!
```

### 2. Rate Limiting

```javascript
// Add rate limiting to prevent abuse
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 requests per minute per IP
});

app.use('/api/chat', limiter);
```

### 3. Input Validation

```javascript
// Validate user input
if (!message || message.length > 500) {
  return res.status(400).json({ error: 'Invalid message' });
}
```

---

## 🎓 Learning Resources

### Official Documentation
- **Gemini API Docs**: https://ai.google.dev/docs
- **Quickstart Guide**: https://ai.google.dev/tutorials/node_quickstart
- **Model Comparison**: https://ai.google.dev/models/gemini

### Tutorials
- **Node.js Integration**: https://ai.google.dev/tutorials/node_quickstart
- **Best Practices**: https://ai.google.dev/docs/best_practices
- **Prompt Engineering**: https://ai.google.dev/docs/prompt_best_practices

---

## ✅ Migration Checklist

- [x] Install `@google/generative-ai` package
- [x] Create `geminiService.js`
- [x] Update `conversationService.js`
- [x] Add `GEMINI_API_KEY` to `.env`
- [x] Remove `OPENAI_API_KEY` from `.env` (optional)
- [x] Test API connection
- [x] Test conversation flow
- [x] Verify voice synthesis still works
- [x] Check conversation memory
- [x] Test with multiple customers

---

## 🎉 You're All Set!

Your Riverwood AI Voice Agent now uses Google Gemini!

**Benefits:**
- ✅ Free tier (no credit card)
- ✅ 50% cost savings
- ✅ Excellent Hindi support
- ✅ Faster responses
- ✅ Larger context window

**Next Steps:**
1. Test with real conversations
2. Monitor response quality
3. Adjust temperature/settings if needed
4. Consider upgrading to Pro for complex cases

Happy building! 🚀✨
