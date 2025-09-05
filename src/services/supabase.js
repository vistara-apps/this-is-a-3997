import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User authentication functions
export const authService = {
  // Sign up new user
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database service functions
export const dbService = {
  // User profile operations
  async createUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          user_id: userId,
          email: profileData.email,
          subscription_status: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...profileData
        }])
        .select()
      
      if (error) throw error
      return { data: data[0], error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
      
      if (error) throw error
      return { data: data[0], error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Saved guides operations
  async saveGuide(userId, guideId) {
    try {
      const { data, error } = await supabase
        .from('saved_guides')
        .insert([{
          user_id: userId,
          guide_id: guideId,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return { data: data[0], error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async getSavedGuides(userId) {
    try {
      const { data, error } = await supabase
        .from('saved_guides')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  async removeSavedGuide(userId, guideId) {
    try {
      const { error } = await supabase
        .from('saved_guides')
        .delete()
        .eq('user_id', userId)
        .eq('guide_id', guideId)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Saved scripts operations
  async saveScript(userId, scriptId) {
    try {
      const { data, error } = await supabase
        .from('saved_scripts')
        .insert([{
          user_id: userId,
          script_id: scriptId,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return { data: data[0], error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async getSavedScripts(userId) {
    try {
      const { data, error } = await supabase
        .from('saved_scripts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Recorded incidents operations
  async saveIncident(userId, incidentData) {
    try {
      const { data, error } = await supabase
        .from('recorded_incidents')
        .insert([{
          user_id: userId,
          timestamp: incidentData.timestamp,
          location: incidentData.location,
          recording_path: incidentData.recordingPath,
          notes: incidentData.notes,
          shareable_card_url: incidentData.shareableCardUrl,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return { data: data[0], error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async getIncidents(userId) {
    try {
      const { data, error } = await supabase
        .from('recorded_incidents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  async deleteIncident(userId, incidentId) {
    try {
      const { error } = await supabase
        .from('recorded_incidents')
        .delete()
        .eq('user_id', userId)
        .eq('incident_id', incidentId)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }
}

// File storage service
export const storageService = {
  // Upload recording file
  async uploadRecording(file, userId, incidentId) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${incidentId}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('recordings')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) throw error
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName)
      
      return { url: publicUrl, path: fileName, error: null }
    } catch (error) {
      return { url: null, path: null, error: error.message }
    }
  },

  // Delete recording file
  async deleteRecording(filePath) {
    try {
      const { error } = await supabase.storage
        .from('recordings')
        .remove([filePath])
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Get signed URL for private access
  async getSignedUrl(filePath, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from('recordings')
        .createSignedUrl(filePath, expiresIn)
      
      if (error) throw error
      return { url: data.signedUrl, error: null }
    } catch (error) {
      return { url: null, error: error.message }
    }
  }
}
