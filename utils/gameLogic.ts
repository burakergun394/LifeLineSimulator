import { Character, CharacterStats, StatChange } from '../types/character';
import { GameEvent, GameChoice, EventResult, GamePhase } from '../types/game';

export class GameLogic {
  
  /**
   * Calculate character's life phase based on age
   */
  static getLifePhase(age: number): GamePhase {
    if (age < 13) return 'childhood';
    if (age < 18) return 'adolescence';
    if (age < 30) return 'young_adult';
    if (age < 50) return 'adult';
    if (age < 65) return 'middle_age';
    return 'senior';
  }

  /**
   * Apply stat changes to character
   */
  static applyStatChanges(character: Character, statChanges: StatChange[]): Character {
    const newStats = { ...character.stats };
    
    statChanges.forEach(change => {
      const currentValue = newStats[change.type];
      const newValue = Math.max(0, Math.min(100, currentValue + change.value));
      newStats[change.type] = newValue;
    });

    return {
      ...character,
      stats: newStats
    };
  }

  /**
   * Check if character meets event prerequisites
   */
  static canAccessEvent(character: Character, event: GameEvent, completedEvents: string[]): boolean {
    // Age range check
    if (character.age < event.ageRange.min || character.age > event.ageRange.max) {
      return false;
    }

    // Prerequisites check
    if (event.prerequisites) {
      // Minimum stats check
      if (event.prerequisites.minStats) {
        for (const [stat, minValue] of Object.entries(event.prerequisites.minStats)) {
          if (character.stats[stat as keyof CharacterStats] < minValue) {
            return false;
          }
        }
      }

      // Required events check
      if (event.prerequisites.requiredEvents) {
        for (const requiredEvent of event.prerequisites.requiredEvents) {
          if (!completedEvents.includes(requiredEvent)) {
            return false;
          }
        }
      }

      // Forbidden events check
      if (event.prerequisites.forbiddenEvents) {
        for (const forbiddenEvent of event.prerequisites.forbiddenEvents) {
          if (completedEvents.includes(forbiddenEvent)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Check if character can make a specific choice
   */
  static canMakeChoice(character: Character, choice: GameChoice, completedEvents: string[]): boolean {
    if (!choice.requirements) return true;

    // Age requirements
    if (choice.requirements.minAge && character.age < choice.requirements.minAge) {
      return false;
    }
    if (choice.requirements.maxAge && character.age > choice.requirements.maxAge) {
      return false;
    }

    // Stat requirements
    if (choice.requirements.minStats) {
      for (const [stat, minValue] of Object.entries(choice.requirements.minStats)) {
        if (character.stats[stat as keyof CharacterStats] < minValue) {
          return false;
        }
      }
    }

    // Required events
    if (choice.requirements.requiredEvents) {
      for (const requiredEvent of choice.requirements.requiredEvents) {
        if (!completedEvents.includes(requiredEvent)) {
          return false;
        }
      }
    }

    // Forbidden events
    if (choice.requirements.forbiddenEvents) {
      for (const forbiddenEvent of choice.requirements.forbiddenEvents) {
        if (completedEvents.includes(forbiddenEvent)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Process choice selection and return results
   */
  static processChoice(
    character: Character,
    choice: GameChoice,
    completedEvents: string[]
  ): EventResult {
    const statChanges: StatChange[] = [];

    // Convert choice effects to stat changes
    Object.entries(choice.effect).forEach(([stat, value]) => {
      if (stat in character.stats) {
        statChanges.push({
          type: stat as keyof CharacterStats,
          value: value,
          reason: choice.text
        });
      }
    });

    const result: EventResult = {
      success: true,
      statChanges,
    };

    // Handle consequences
    if (choice.consequences) {
      result.unlockedEvents = choice.consequences.unlockEvents;
      result.lockedEvents = choice.consequences.lockEvents;
    }

    return result;
  }

  /**
   * Filter available events based on character state
   */
  static getAvailableEvents(
    character: Character,
    allEvents: GameEvent[],
    completedEvents: string[]
  ): GameEvent[] {
    return allEvents.filter(event => {
      // Skip if already completed and not repeatable
      if (!event.isRepeatable && completedEvents.includes(event.id)) {
        return false;
      }

      return this.canAccessEvent(character, event, completedEvents);
    });
  }

  /**
   * Calculate character's overall well-being score
   */
  static calculateWellBeingScore(stats: CharacterStats): number {
    const weights = {
      health: 0.25,
      happiness: 0.25,
      intelligence: 0.15,
      wealth: 0.15,
      social: 0.20
    };

    return Math.round(
      stats.health * weights.health +
      stats.happiness * weights.happiness +
      stats.intelligence * weights.intelligence +
      stats.wealth * weights.wealth +
      stats.social * weights.social
    );
  }

  /**
   * Generate random event based on character state and rarity
   */
  static selectRandomEvent(availableEvents: GameEvent[], character: Character): GameEvent | null {
    if (availableEvents.length === 0) return null;

    // Create weighted array based on rarity
    const weightedEvents: GameEvent[] = [];
    
    availableEvents.forEach(event => {
      let weight = 1;
      switch (event.rarity) {
        case 'common': weight = 10; break;
        case 'uncommon': weight = 5; break;
        case 'rare': weight = 2; break;
        case 'legendary': weight = 1; break;
      }
      
      for (let i = 0; i < weight; i++) {
        weightedEvents.push(event);
      }
    });

    const randomIndex = Math.floor(Math.random() * weightedEvents.length);
    return weightedEvents[randomIndex];
  }

  /**
   * Check if game should end (character death conditions)
   */
  static shouldGameEnd(character: Character): { ended: boolean; reason?: string } {
    // Health-based death
    if (character.stats.health <= 0) {
      return { ended: true, reason: 'Sağlık durumun kritik seviyeye düştü.' };
    }

    // Age-based death (with some randomness)
    if (character.age >= 80) {
      const deathChance = (character.age - 80) * 0.1 + (100 - character.stats.health) * 0.02;
      if (Math.random() < deathChance) {
        return { ended: true, reason: 'Yaşlılık nedeniyle hayatın sona erdi.' };
      }
    }

    return { ended: false };
  }
}

export default GameLogic;