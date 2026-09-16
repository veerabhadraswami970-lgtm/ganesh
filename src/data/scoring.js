/**
 * Scoring and progression state manager for Ganesha: The 21 Modaks
 */
import { supabaseService } from './supabase.js';

export const SCORING_TABLE = {
  MODAK_COLLECTED: 100,
  CHALLENGE_COMPLETED: 500,
  FAST_COMPLETION_MIN: 100,
  FAST_COMPLETION_MAX: 300,
  PERFECT_BONUS: 250,
  ECO_ACTION: 100,
  MISTAKE: -50,
  HINT_USED: -25,
  FINAL_21_COMPLETION: 2000
};

export const RATING_BANDS = [
  { min: 9000, title: 'Vighna Vinashi', desc: 'Supreme Remover of All Obstacles! Blessed by Bappa.' },
  { min: 6000, title: 'Wisdom Champion', desc: 'True devotee with extraordinary intellect and agility!' },
  { min: 3000, title: 'Bappa Helper', desc: 'Devoted helper who brought great joy to the pandal!' },
  { min: 0, title: 'Festival Starter', desc: 'A wonderful beginning to the festive celebrations!' }
];

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.modaksCollected = 0;
    this.targetModaks = 21;
    this.currentChallengeIndex = 0;
    this.completedChallenges = [];
    this.streak = 0;
    this.blessingUsed = false;
    this.lastVighnahartaTime = 0;
    this.challengeStats = {
      startTime: 0,
      mistakes: 0,
      hintsUsed: 0,
      modaksEarned: 0,
      ecoActions: 0
    };
  }

  getHighScore() {
    try {
      return parseInt(localStorage.getItem('ganesha_21_modaks_highscore') || '0', 10);
    } catch {
      return 0;
    }
  }

  saveHighScore(playerName = 'Devotee') {
    try {
      const current = this.getHighScore();
      if (this.score > current) {
        localStorage.setItem('ganesha_21_modaks_highscore', this.score.toString());
      }
      // Submit to Supabase Global Leaderboard (if configured)
      const rating = this.getRating();
      supabaseService.submitScore(playerName, this.score, this.modaksCollected, rating.title);
      return true;
    } catch {
      // Ignore localStorage access errors
    }
    return false;
  }

  addScore(points) {
    this.score = Math.max(0, this.score + points);
    return this.score;
  }

  addStreakBonus() {
    this.streak++;
    const bonus = Math.min(this.streak * 10, 100);
    this.score += bonus;
    return bonus;
  }

  resetStreak() {
    this.streak = 0;
  }

  recordMistake() {
    this.resetStreak();
    this.challengeStats.mistakes++;
    this.addScore(SCORING_TABLE.MISTAKE);
  }

  recordModak() {
    this.modaksCollected++;
    this.challengeStats.modaksEarned++;
    this.addScore(SCORING_TABLE.MODAK_COLLECTED);
  }

  getRating() {
    for (const band of RATING_BANDS) {
      if (this.score >= band.min) {
        return band;
      }
    }
    return RATING_BANDS[RATING_BANDS.length - 1];
  }
}

export const gameState = new GameState();
