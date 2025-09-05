-- KnowYourRights Aid Database Schema
-- This file contains the complete database schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
    selected_state VARCHAR(50) DEFAULT 'California',
    stripe_customer_id VARCHAR(255),
    subscription_id VARCHAR(255),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guides table (for storing legal guides)
CREATE TABLE IF NOT EXISTS guides (
    guide_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    language VARCHAR(20) DEFAULT 'english',
    category VARCHAR(50),
    tags TEXT[],
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scripts table (for storing "What to Say" scripts)
CREATE TABLE IF NOT EXISTS scripts (
    script_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    scenario VARCHAR(100) NOT NULL,
    content JSONB NOT NULL, -- Stores structured script data
    language VARCHAR(20) DEFAULT 'english',
    state VARCHAR(50),
    is_premium BOOLEAN DEFAULT FALSE,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved guides (user bookmarks)
CREATE TABLE IF NOT EXISTS saved_guides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    guide_id UUID REFERENCES guides(guide_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, guide_id)
);

-- Saved scripts (user bookmarks)
CREATE TABLE IF NOT EXISTS saved_scripts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    script_id UUID REFERENCES scripts(script_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, script_id)
);

-- Recorded incidents table
CREATE TABLE IF NOT EXISTS recorded_incidents (
    incident_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    recording_path VARCHAR(500), -- Path to file in Supabase Storage
    recording_url VARCHAR(500), -- Public URL if applicable
    notes TEXT,
    shareable_card_url VARCHAR(500),
    duration INTEGER, -- Duration in seconds
    file_size INTEGER, -- File size in bytes
    file_type VARCHAR(50), -- MIME type
    is_cloud_stored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI generated content tracking
CREATE TABLE IF NOT EXISTS ai_generations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    generation_type VARCHAR(50) NOT NULL, -- 'script', 'incident_card', 'guidance'
    prompt_data JSONB NOT NULL,
    response_data JSONB NOT NULL,
    tokens_used INTEGER,
    cost_cents INTEGER, -- Cost in cents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity log
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription events (for tracking payment history)
CREATE TABLE IF NOT EXISTS subscription_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'cancelled', 'payment_succeeded', 'payment_failed'
    stripe_event_id VARCHAR(255),
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_selected_state ON users(selected_state);
CREATE INDEX IF NOT EXISTS idx_guides_state ON guides(state);
CREATE INDEX IF NOT EXISTS idx_guides_language ON guides(language);
CREATE INDEX IF NOT EXISTS idx_guides_is_premium ON guides(is_premium);
CREATE INDEX IF NOT EXISTS idx_scripts_scenario ON scripts(scenario);
CREATE INDEX IF NOT EXISTS idx_scripts_language ON scripts(language);
CREATE INDEX IF NOT EXISTS idx_scripts_state ON scripts(state);
CREATE INDEX IF NOT EXISTS idx_scripts_is_premium ON scripts(is_premium);
CREATE INDEX IF NOT EXISTS idx_saved_guides_user_id ON saved_guides(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_scripts_user_id ON saved_scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_recorded_incidents_user_id ON recorded_incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_recorded_incidents_timestamp ON recorded_incidents(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_type ON ai_generations(generation_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recorded_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = user_id);

-- Saved guides policies
CREATE POLICY "Users can view own saved guides" ON saved_guides
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved guides" ON saved_guides
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved guides" ON saved_guides
    FOR DELETE USING (auth.uid() = user_id);

-- Saved scripts policies
CREATE POLICY "Users can view own saved scripts" ON saved_scripts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved scripts" ON saved_scripts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved scripts" ON saved_scripts
    FOR DELETE USING (auth.uid() = user_id);

-- Recorded incidents policies
CREATE POLICY "Users can view own incidents" ON recorded_incidents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own incidents" ON recorded_incidents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incidents" ON recorded_incidents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own incidents" ON recorded_incidents
    FOR DELETE USING (auth.uid() = user_id);

-- AI generations policies
CREATE POLICY "Users can view own AI generations" ON ai_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI generations" ON ai_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User activity policies
CREATE POLICY "Users can view own activity" ON user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscription events policies
CREATE POLICY "Users can view own subscription events" ON subscription_events
    FOR SELECT USING (auth.uid() = user_id);

-- Public access to guides and scripts (with premium restrictions handled in app)
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view guides" ON guides
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view scripts" ON scripts
    FOR SELECT USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (user_id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for recordings (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('recordings', 'recordings', false);

-- Storage policies for recordings bucket
-- CREATE POLICY "Users can upload own recordings" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view own recordings" ON storage.objects
--     FOR SELECT USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete own recordings" ON storage.objects
--     FOR DELETE USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Sample data insertion (optional)
-- Insert some sample guides
INSERT INTO guides (title, state, summary, content, language, category, is_premium) VALUES
('Your Rights During a Traffic Stop', 'California', 'Essential rights and procedures for traffic stops in California', 
'# Your Rights During a Traffic Stop in California

## Key Rights

### 1. Right to Remain Silent
- You have the constitutional right to remain silent
- You only need to provide your driver''s license, registration, and proof of insurance
- You can politely say: "I am exercising my right to remain silent"

### 2. Search and Seizure Protection
- Police need probable cause or your consent to search your vehicle
- You can refuse a search by saying: "I do not consent to any searches"
- Never physically resist, but clearly state your objection

### 3. Right to Record
- You have the right to record police interactions in California
- Keep your phone visible and announce you are recording
- Do not interfere with the officer''s duties', 'english', 'traffic', false),

('Know Your Rights: Street Encounters', 'New York', 'Understanding your rights during street encounters with police in New York', 
'# Street Encounters in New York

## Stop and Frisk Laws

### What You Should Know
- Police can stop you if they have reasonable suspicion of criminal activity
- You have the right to ask "Am I free to leave?"
- If you''re not under arrest, you can walk away

### Your Rights
1. Right to remain silent
2. Right to refuse consent to search
3. Right to ask for a lawyer if arrested', 'english', 'street', false);

-- Insert some sample scripts
INSERT INTO scripts (title, scenario, content, language, state, is_premium) VALUES
('Traffic Stop Script', 'traffic_stop', '{
  "keyPhrases": [
    "I am exercising my right to remain silent",
    "I do not consent to any searches",
    "Am I free to leave?",
    "I would like to speak to a lawyer"
  ],
  "doSay": [
    "Keep your hands visible at all times",
    "Provide license, registration, and insurance when asked",
    "State clearly: I am exercising my right to remain silent",
    "If asked about searches: I do not consent to any searches"
  ],
  "dontSay": [
    "Don''t argue or become confrontational",
    "Don''t lie or provide false information",
    "Don''t reach for anything without permission",
    "Don''t admit to any wrongdoing"
  ],
  "explanation": "These phrases invoke your constitutional rights while maintaining a respectful tone.",
  "tips": [
    "Stay calm and keep hands visible",
    "Record the interaction if possible",
    "Remember badge numbers and patrol car numbers",
    "Contact a lawyer as soon as possible if arrested"
  ]
}', 'english', 'California', false),

('Street Encounter Script', 'street_encounter', '{
  "keyPhrases": [
    "Am I free to leave?",
    "I do not consent to any searches",
    "I am exercising my right to remain silent",
    "I want to speak to a lawyer"
  ],
  "doSay": [
    "Ask politely: Am I free to leave?",
    "If stopped: I am exercising my right to remain silent",
    "If asked to search: I do not consent to any searches",
    "Stay calm and keep hands visible"
  ],
  "dontSay": [
    "Don''t run or physically resist",
    "Don''t argue about the legality of the stop",
    "Don''t consent to searches",
    "Don''t answer questions beyond identifying yourself"
  ],
  "explanation": "Street encounters require clear assertion of your rights while avoiding escalation.",
  "tips": [
    "You can ask if you''re free to leave",
    "You don''t have to answer questions beyond identification",
    "Record if possible and safe to do so",
    "Get witness contact information if available"
  ]
}', 'english', 'New York', false);
