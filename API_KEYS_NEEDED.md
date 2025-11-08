# 🔑 API Keys Required for Riverwood AI Voice Agent

## Current Configuration Summary

Your app uses **2 APIs** that need API keys:

---

## 1️⃣ **Google Gemini API** (For AI Conversations)

### What it does:
- Powers the AI chatbot responses
- Generates conversational replies in Hinglish
- Handles customer queries about construction updates

### Where it's used:
- **File**: `backend/services/geminiService.js`
- **Model**: `gemini-pro`
- **Environment Variable**: `GEMINI_API_KEY`

### Current Status: ❌ NOT WORKING
**Your key**: `AIzaSyAbAmxafSlc2qU4PSHXLL909izzrsiM0zU`

**Problem**: The API key is being rejected with error:
```
API key not valid. Please pass a valid API key.
```

### Why it's not working:
1. **Generative Language API not enabled** in your Google Cloud project
2. **Billing not set up** (required even for free tier)
3. **API key created before enabling the API**
4. **Wrong API enabled** (might have enabled "Gemini API" marketplace instead of "Generative Language API")

### ✅ How to fix:

#### Step 1: Enable Billing
1. Go to: https://console.cloud.google.com/billing?project=594249285059
2. Link a billing account (credit card required)
3. **Note**: Free tier won't charge you (60 requests/minute free)

#### Step 2: Enable the Correct API
1. Go to: https://console.cloud.google.com/marketplace/product/google/generativelanguage.googleapis.com?project=594249285059
2. Click **"ENABLE"**
3. Wait 2-5 minutes for activation

#### Step 3: Create New API Key
1. **After** billing and API are enabled, go to: https://aistudio.google.com/app/apikey
2. Select your "Riverwood" project (594249285059)
3. Click **"Create API key in existing project"**
4. Copy the new key
5. Update `backend/.env`:
   ```env
   GEMINI_API_KEY=AIzaSy_YOUR_NEW_KEY_HERE
   ```

#### Step 4: Test
```powershell
cd backend
node test-direct.js
```

---

## 2️⃣ **ElevenLabs API** (For Voice Synthesis)

### What it does:
- Converts AI text responses to speech
- Generates natural-sounding voice audio
- Provides voice for the AI assistant "Priya"

### Where it's used:
- **File**: `backend/services/voiceService.js`
- **Voice ID**: `mfMM3ijQgz8QtMeKifko`
- **Environment Variable**: `ELEVENLABS_API_KEY`

### Current Status: ✅ CONFIGURED
**Your key**: `sk_14914d0df136ee2f12f17e387b3fe435f76cc5d8c38077e6`

### How to get:
1. Go to: https://elevenlabs.io/
2. Sign up (choose **"Creative Platform"** not "Agents Platform")
3. Go to Profile → API Keys
4. Copy your API key
5. Update `backend/.env`:
   ```env
   ELEVENLABS_API_KEY=sk_your_key_here
   ELEVENLABS_VOICE_ID=mfMM3ijQgz8QtMeKifko
   ```

### Free Tier:
- ✅ 10,000 characters per month
- ✅ All voices available
- ✅ No credit card required

---

## 📋 Your Current `.env` File Should Look Like:

```env
# Gemini Configuration (For AI Chat)
GEMINI_API_KEY=AIzaSy_YOUR_WORKING_KEY_HERE

# ElevenLabs Configuration (For Voice)
ELEVENLABS_API_KEY=sk_14914d0df136ee2f12f17e387b3fe435f76cc5d8c38077e6
ELEVENLABS_VOICE_ID=mfMM3ijQgz8QtMeKifko

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 🔍 How to Verify Each API

### Test Gemini:
```powershell
cd backend
node test-direct.js
```

**Expected output:**
```
✅ SUCCESS with gemini-pro!
Response: नमस्ते! Hello!
```

### Test ElevenLabs:
```powershell
cd backend
npm run test:voice
```

**Expected output:**
```
✅ Voice synthesis successful
Audio saved to: test-output.mp3
```

---

## 🚨 Current Issue: GEMINI API KEY NOT WORKING

### The Error:
```
[GoogleGenerativeAI Error]: Error fetching from 
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
[400 Bad Request] API key not valid. Please pass a valid API key.
```

### What This Means:
Your Gemini API key exists but is **not authorized** to use the Generative Language API.

### Root Cause:
Google requires:
1. ✅ API key created (you have this)
2. ❌ Billing enabled (you need this)
3. ❌ Generative Language API enabled (you need this)
4. ❌ API key created AFTER enabling API (you need this)

---

## 💡 Quick Solution Options

### Option A: Fix Gemini (Recommended)
1. Enable billing on Google Cloud
2. Enable Generative Language API
3. Create new API key
4. Test and run

**Time**: 10-15 minutes
**Cost**: Free (60 requests/min)

### Option B: Use Mock Mode (Temporary)
Run the app with mock responses (no real AI):
```powershell
cd frontend
npm run dev
```
Open: http://localhost:5173
Click "Interactive Demo" button

**Time**: Immediate
**Cost**: Free
**Limitation**: Scripted responses only

### Option C: Switch to OpenAI (Alternative)
If Gemini continues to have issues:
1. Get OpenAI API key: https://platform.openai.com/api-keys
2. Add $5-10 credits
3. Update code to use OpenAI

**Time**: 5 minutes
**Cost**: ~$0.15 per 1M tokens

---

## 📊 API Usage & Costs

### Gemini (Free Tier):
- **Limit**: 60 requests per minute
- **Cost**: $0 (free tier)
- **Paid**: $0.075 per 1M input tokens

### ElevenLabs (Free Tier):
- **Limit**: 10,000 characters per month
- **Cost**: $0 (free tier)
- **Paid**: $0.30 per 1,000 characters

### Estimated Monthly Cost (100 conversations/day):
- Gemini: **$0** (within free tier)
- ElevenLabs: **$0** (within free tier)
- **Total: $0/month** 🎉

---

## ✅ Action Items

To get your app working:

- [ ] Enable billing on Google Cloud project (594249285059)
- [ ] Enable "Generative Language API" (not just "Gemini API")
- [ ] Create NEW API key from https://aistudio.google.com/app/apikey
- [ ] Update `backend/.env` with new Gemini key
- [ ] Test with `node test-direct.js`
- [ ] Start backend: `npm run dev`
- [ ] Start frontend: `npm run dev`
- [ ] Open http://localhost:5173

---

## 🆘 Still Not Working?

If Gemini still doesn't work after following all steps:

1. **Check API Dashboard**: https://console.cloud.google.com/apis/dashboard?project=594249285059
   - Verify "Generative Language API" shows as "Enabled"

2. **Check Billing**: https://console.cloud.google.com/billing?project=594249285059
   - Verify billing account is linked

3. **Wait 24 hours**: Sometimes Google APIs take time to fully activate

4. **Use Demo Mode**: Frontend works without backend for testing UI

---

## 📞 Support Links

- **Gemini Docs**: https://ai.google.dev/docs
- **Gemini API Keys**: https://aistudio.google.com/app/apikey
- **Google Cloud Console**: https://console.cloud.google.com/
- **ElevenLabs Docs**: https://elevenlabs.io/docs
- **ElevenLabs API Keys**: https://elevenlabs.io/app/settings/api-keys

---

**Last Updated**: November 7, 2025
**Your Project ID**: 594249285059 (Riverwood)
