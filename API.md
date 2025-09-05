# KnowYourRights Aid - API Documentation

This document outlines the API integrations and service architecture for the KnowYourRights Aid application.

## 🏗 Architecture Overview

The application follows a modern JAMstack architecture with the following components:

- **Frontend**: React SPA with Vite bundling
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for file uploads
- **AI Services**: OpenAI GPT-3.5 Turbo
- **Payments**: Stripe for subscription management

## 🗄 Database API (Supabase)

### Authentication Endpoints

#### Sign Up
```javascript
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "data": {
    "selectedState": "California"
  }
}
```

#### Sign In
```javascript
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Sign Out
```javascript
POST /auth/v1/logout
Authorization: Bearer <jwt_token>
```

### Database Operations

#### User Profile
```javascript
// Get user profile
GET /rest/v1/users?user_id=eq.<user_id>
Authorization: Bearer <jwt_token>

// Update user profile
PATCH /rest/v1/users?user_id=eq.<user_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "selected_state": "New York",
  "subscription_status": "premium"
}
```

#### Guides
```javascript
// Get all guides
GET /rest/v1/guides?select=*

// Get guides by state
GET /rest/v1/guides?state=eq.California&select=*

// Get premium guides (requires authentication)
GET /rest/v1/guides?is_premium=eq.true&select=*
Authorization: Bearer <jwt_token>
```

#### Scripts
```javascript
// Get all scripts
GET /rest/v1/scripts?select=*

// Get scripts by scenario
GET /rest/v1/scripts?scenario=eq.traffic_stop&select=*

// Get scripts by language
GET /rest/v1/scripts?language=eq.spanish&select=*
Authorization: Bearer <jwt_token>
```

#### Saved Content
```javascript
// Save a guide
POST /rest/v1/saved_guides
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "guide_id": "uuid-here"
}

// Get saved guides
GET /rest/v1/saved_guides?select=*,guides(*)
Authorization: Bearer <jwt_token>

// Remove saved guide
DELETE /rest/v1/saved_guides?guide_id=eq.<guide_id>
Authorization: Bearer <jwt_token>
```

#### Recorded Incidents
```javascript
// Save incident
POST /rest/v1/recorded_incidents
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "timestamp": "2024-01-15T10:30:00Z",
  "location": "123 Main St, City, State",
  "recording_path": "user_id/incident_id.mp4",
  "notes": "Traffic stop on Main Street",
  "duration": 180
}

// Get user incidents
GET /rest/v1/recorded_incidents?select=*&order=created_at.desc
Authorization: Bearer <jwt_token>
```

### Storage API

#### Upload Recording
```javascript
POST /storage/v1/object/recordings/<file_path>
Authorization: Bearer <jwt_token>
Content-Type: video/mp4

<binary_file_data>
```

#### Get File URL
```javascript
GET /storage/v1/object/public/recordings/<file_path>

// Or for signed URLs (private files)
POST /storage/v1/object/sign/recordings/<file_path>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "expiresIn": 3600
}
```

## 🤖 AI Services (OpenAI)

### Script Generation

#### Generate Custom Script
```javascript
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer <openai_api_key>
Content-Type: application/json

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a legal rights advisor..."
    },
    {
      "role": "user",
      "content": "Generate a script for traffic stop in California..."
    }
  ],
  "max_tokens": 1000,
  "temperature": 0.3
}
```

#### Response Format
```javascript
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "{\"title\":\"Traffic Stop Script\",\"keyPhrases\":[...],\"doSay\":[...],\"dontSay\":[...],\"explanation\":\"...\",\"tips\":[...]}"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350
  }
}
```

### Incident Card Generation

#### Generate Incident Summary
```javascript
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer <openai_api_key>
Content-Type: application/json

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a legal documentation assistant..."
    },
    {
      "role": "user",
      "content": "Generate incident summary for: timestamp, location, notes..."
    }
  ],
  "max_tokens": 800,
  "temperature": 0.2
}
```

## 💳 Payment Services (Stripe)

### Create Checkout Session

#### Server-Side Endpoint (Required)
```javascript
POST /api/create-checkout-session
Content-Type: application/json

{
  "priceId": "price_premium_monthly",
  "userId": "user_uuid",
  "userEmail": "user@example.com",
  "successUrl": "https://app.com/success",
  "cancelUrl": "https://app.com/cancel"
}
```

#### Response
```javascript
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### Webhook Handling

#### Payment Success Webhook
```javascript
POST /api/webhooks/stripe
Stripe-Signature: <signature>
Content-Type: application/json

{
  "id": "evt_...",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "customer": "cus_...",
      "subscription": "sub_...",
      "metadata": {
        "userId": "user_uuid"
      }
    }
  }
}
```

### Subscription Management

#### Get Subscription Details
```javascript
GET https://api.stripe.com/v1/subscriptions/<subscription_id>
Authorization: Bearer <stripe_secret_key>
```

#### Cancel Subscription
```javascript
DELETE https://api.stripe.com/v1/subscriptions/<subscription_id>
Authorization: Bearer <stripe_secret_key>
```

## 🔧 Service Layer Implementation

### Supabase Service (`src/services/supabase.js`)

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export const authService = {
  async signUp(email, password, metadata) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    return { user: data.user, error }
  },
  
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { user: data.user, error }
  }
}

export const dbService = {
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },
  
  async saveIncident(userId, incidentData) {
    const { data, error } = await supabase
      .from('recorded_incidents')
      .insert([{
        user_id: userId,
        ...incidentData
      }])
    return { data, error }
  }
}
```

### OpenAI Service (`src/services/openai.js`)

```javascript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export const aiService = {
  async generateScript(scenario, state, language, context) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal rights advisor..."
          },
          {
            role: "user",
            content: `Generate script for ${scenario} in ${state}...`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
      
      const response = completion.choices[0].message.content
      return { data: JSON.parse(response), error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}
```

### Stripe Service (`src/services/stripe.js`)

```javascript
export const paymentService = {
  async createCheckoutSession(userId, userEmail, successUrl, cancelUrl) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.VITE_STRIPE_PREMIUM_PRICE_ID,
          userId,
          userEmail,
          successUrl,
          cancelUrl
        })
      })
      
      const { sessionId } = await response.json()
      
      const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY)
      await stripe.redirectToCheckout({ sessionId })
      
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
```

## 🔒 Security Considerations

### API Key Management
- Store all API keys in environment variables
- Never expose secret keys in client-side code
- Use different keys for development and production
- Rotate keys regularly

### Row Level Security (RLS)
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own incidents" ON recorded_incidents
  FOR SELECT USING (auth.uid() = user_id);
```

### CORS Configuration
```javascript
// Supabase automatically handles CORS
// For custom APIs, configure allowed origins:
const corsOptions = {
  origin: ['https://your-domain.com', 'http://localhost:5173'],
  credentials: true
}
```

## 📊 Rate Limiting & Quotas

### OpenAI Limits
- **Free Tier**: $5 credit, ~1000 requests
- **Pay-as-you-go**: $0.002 per 1K tokens
- **Rate Limits**: 3 RPM (requests per minute) for free tier

### Supabase Limits
- **Free Tier**: 500MB database, 1GB bandwidth
- **Pro Tier**: 8GB database, 100GB bandwidth
- **API Requests**: 50,000 per month (free tier)

### Stripe Limits
- **Test Mode**: No limits
- **Live Mode**: 100 requests per second per account

## 🧪 Testing APIs

### Development Testing
```javascript
// Test Supabase connection
const testSupabase = async () => {
  const { data, error } = await supabase
    .from('guides')
    .select('count')
  console.log('Supabase test:', { data, error })
}

// Test OpenAI connection
const testOpenAI = async () => {
  const result = await aiService.generateScript(
    'traffic_stop',
    'California',
    'english'
  )
  console.log('OpenAI test:', result)
}
```

### API Monitoring
```javascript
// Add request logging
const apiLogger = (service, method, params, result) => {
  console.log(`[${service}] ${method}`, {
    params,
    success: !result.error,
    timestamp: new Date().toISOString()
  })
}
```

## 🚨 Error Handling

### Standard Error Format
```javascript
{
  success: false,
  error: {
    code: 'INVALID_REQUEST',
    message: 'User-friendly error message',
    details: 'Technical details for debugging'
  }
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication needed
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RATE_LIMITED`: Too many requests
- `INVALID_REQUEST`: Malformed request data
- `SERVICE_UNAVAILABLE`: External service down
- `QUOTA_EXCEEDED`: Usage limits exceeded

---

**For API support, contact: support@knowyourrights.app**
