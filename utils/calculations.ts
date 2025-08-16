import { CharacterStats } from '../types/character';
import { GamePhase } from '../types/game';

export class Calculations {
  
  /**
   * Calculate percentage of a stat relative to max value
   */
  static getStatPercentage(value: number, maxValue: number = 100): number {
    return Math.max(0, Math.min(100, (value / maxValue) * 100));
  }

  /**
   * Calculate stat change with diminishing returns
   */
  static applyDiminishingReturns(currentValue: number, change: number, maxValue: number = 100): number {
    if (change > 0) {
      // Positive changes have diminishing returns as you approach max
      const remainingSpace = maxValue - currentValue;
      const efficiency = remainingSpace / maxValue;
      const adjustedChange = change * efficiency;
      return Math.min(maxValue, currentValue + adjustedChange);
    } else {
      // Negative changes apply linearly
      return Math.max(0, currentValue + change);
    }
  }

  /**
   * Calculate natural stat decay based on age and life phase
   */
  static calculateNaturalDecay(stats: CharacterStats, age: number, phase: GamePhase): Partial<CharacterStats> {
    const decay: Partial<CharacterStats> = {};

    switch (phase) {
      case 'childhood':
      case 'adolescence':
        // No natural decay, actually some growth
        return {};

      case 'young_adult':
        // Very minimal decay
        decay.health = -0.5;
        break;

      case 'adult':
        // Gradual decay begins
        decay.health = -1;
        decay.happiness = -0.2;
        break;

      case 'middle_age':
        // More significant decay
        decay.health = -1.5;
        decay.happiness = -0.3;
        decay.social = -0.2;
        break;

      case 'senior':
        // Significant decay
        decay.health = -2;
        decay.happiness = -0.5;
        decay.social = -0.5;
        decay.intelligence = -0.3;
        break;
    }

    return decay;
  }

  /**
   * Calculate experience points for stat improvements
   */
  static calculateStatXP(currentValue: number, improvement: number): number {
    // Higher stats require more XP to improve
    const baseXP = improvement * 10;
    const difficultyMultiplier = 1 + (currentValue / 100);
    return Math.round(baseXP * difficultyMultiplier);
  }

  /**
   * Calculate life expectancy based on current stats
   */
  static calculateLifeExpectancy(stats: CharacterStats, currentAge: number): number {
    const baseLifeExpectancy = 75;
    
    // Health has the biggest impact
    const healthBonus = (stats.health - 50) * 0.3;
    
    // Happiness affects longevity
    const happinessBonus = (stats.happiness - 50) * 0.1;
    
    // Wealth provides access to better healthcare
    const wealthBonus = (stats.wealth - 50) * 0.15;
    
    // Social connections improve mental health
    const socialBonus = (stats.social - 50) * 0.05;
    
    const totalBonus = healthBonus + happinessBonus + wealthBonus + socialBonus;
    const expectedAge = baseLifeExpectancy + totalBonus;
    
    return Math.max(currentAge + 1, Math.round(expectedAge));
  }

  /**
   * Calculate success probability for a choice based on character stats
   */
  static calculateSuccessProbability(
    requiredStats: Partial<CharacterStats>,
    characterStats: CharacterStats
  ): number {
    if (Object.keys(requiredStats).length === 0) return 1.0;

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(requiredStats).forEach(([stat, required]) => {
      const current = characterStats[stat as keyof CharacterStats];
      const ratio = current / required;
      totalScore += Math.min(1.5, ratio); // Cap at 150% success rate
      totalWeight += 1;
    });

    const averageRatio = totalScore / totalWeight;
    return Math.max(0.1, Math.min(1.0, averageRatio));
  }

  /**
   * Calculate compound interest for wealth growth
   */
  static calculateWealthGrowth(currentWealth: number, interestRate: number, years: number): number {
    return currentWealth * Math.pow(1 + interestRate, years);
  }

  /**
   * Calculate stat synergy bonuses (stats that work well together)
   */
  static calculateSynergyBonus(stats: CharacterStats): Partial<CharacterStats> {
    const bonuses: Partial<CharacterStats> = {};

    // Intelligence + Wealth synergy
    if (stats.intelligence > 70 && stats.wealth > 60) {
      bonuses.wealth = 2; // Smart financial decisions
    }

    // Social + Happiness synergy
    if (stats.social > 70 && stats.happiness > 60) {
      bonuses.happiness = 1;
      bonuses.social = 1;
    }

    // Health + Happiness synergy
    if (stats.health > 80 && stats.happiness > 70) {
      bonuses.health = 1;
    }

    // Intelligence + Social synergy (leadership)
    if (stats.intelligence > 75 && stats.social > 75) {
      bonuses.wealth = 1; // Better career opportunities
    }

    return bonuses;
  }

  /**
   * Calculate random event probability based on character state
   */
  static calculateEventProbability(
    baseChance: number,
    stats: CharacterStats,
    phase: GamePhase
  ): number {
    let modifier = 1.0;

    // Life phase modifiers
    switch (phase) {
      case 'adolescence':
        modifier *= 1.2; // More chaotic period
        break;
      case 'young_adult':
        modifier *= 1.1; // Many life changes
        break;
      case 'senior':
        modifier *= 0.8; // More stable period
        break;
    }

    // Stat-based modifiers
    if (stats.health < 30) modifier *= 1.3; // Health crises
    if (stats.happiness < 30) modifier *= 1.2; // Life changes when unhappy
    if (stats.wealth > 80) modifier *= 0.9; // Wealth provides stability

    return baseChance * modifier;
  }

  /**
   * Format number with appropriate suffix (K, M, B)
   */
  static formatLargeNumber(num: number): string {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Calculate overall character score for leaderboards
   */
  static calculateCharacterScore(stats: CharacterStats, age: number, achievements: string[]): number {
    const statSum = Object.values(stats).reduce((sum, stat) => sum + stat, 0);
    const ageBonus = Math.max(0, age - 18) * 10; // Bonus for living longer
    const achievementBonus = achievements.length * 50;
    
    return statSum + ageBonus + achievementBonus;
  }
}

export default Calculations;