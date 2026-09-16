/**
 * Supabase Client & Global Leaderboard Service for Ganesha: The 21 Modaks
 * Handles persistent global leaderboard scores, player names, and devotee ranks.
 */

export const SUPABASE_CONFIG = {
  // Replace these with your Supabase project credentials
  url: window.SUPABASE_URL || 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co',
  anonKey: window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    this.init();
  }

  init() {
    // Check if Supabase JS SDK is loaded and configured
    if (typeof window.supabase !== 'undefined' && SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.includes('YOUR_SUPABASE')) {
      try {
        this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        this.isConfigured = true;
        console.log('✅ Supabase initialized successfully');
      } catch (e) {
        console.warn('Supabase initialization error:', e);
      }
    }
  }

  configure(url, anonKey) {
    SUPABASE_CONFIG.url = url;
    SUPABASE_CONFIG.anonKey = anonKey;
    if (typeof window.supabase !== 'undefined') {
      this.client = window.supabase.createClient(url, anonKey);
      this.isConfigured = true;
    }
  }

  /**
   * Save a player's score to Supabase table 'leaderboard'
   */
  async submitScore(playerName = 'Devotee', score = 0, modaks = 0, rankTitle = 'Festival Starter') {
    if (!this.isConfigured || !this.client) {
      console.log('ℹ️ Supabase not yet configured, score saved to localStorage only');
      return { success: false, offline: true };
    }

    try {
      const { data, error } = await this.client
        .from('leaderboard')
        .insert([
          {
            player_name: playerName,
            score: score,
            modaks_collected: modaks,
            rank_title: rankTitle,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.warn('Error submitting score to Supabase:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.warn('Supabase submit error:', err);
      return { success: false, error: err };
    }
  }

  /**
   * Fetch top players from Supabase table 'leaderboard'
   */
  async getTopScores(limit = 10) {
    if (!this.isConfigured || !this.client) {
      return [];
    }

    try {
      const { data, error } = await this.client
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Error fetching leaderboard from Supabase:', error.message);
        return [];
      }

      return data || [];
    } catch (err) {
      console.warn('Supabase fetch error:', err);
      return [];
    }
  }
}

export const supabaseService = new SupabaseService();
