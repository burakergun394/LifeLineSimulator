import { Character, StatChange } from './character';

export interface GameChoice {
  id: string;
  text: string;
  effect: Record<string, number>;
  requirements?: {
    minAge?: number;
    maxAge?: number;
    minStats?: Partial<Record<string, number>>;
    requiredEvents?: string[];
    forbiddenEvents?: string[];
  };
  consequences?: {
    unlockEvents?: string[];
    lockEvents?: string[];
    specialEffects?: string[];
  };
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'career' | 'relationship' | 'health' | 'random' | 'major';
  ageRange: {
    min: number;
    max: number;
  };
  choices: GameChoice[];
  prerequisites?: {
    minStats?: Partial<Record<string, number>>;
    requiredEvents?: string[];
    forbiddenEvents?: string[];
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  isRepeatable: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notifications: boolean;
  autoSave: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  language: 'tr' | 'en';
}

export interface GameSave {
  id: string;
  character: Character;
  completedEvents: string[];
  currentEventId: string | null;
  gameYear: number;
  totalPlayTime: number;
  settings: GameSettings;
  createdAt: Date;
  lastPlayedAt: Date;
}

export interface GameSession {
  character: Character;
  currentEvent: GameEvent | null;
  availableEvents: GameEvent[];
  isGameStarted: boolean;
  isPaused: boolean;
  gameYear: number;
  settings: GameSettings;
}

export interface EventResult {
  success: boolean;
  statChanges: StatChange[];
  unlockedEvents?: string[];
  lockedEvents?: string[];
  specialMessage?: string;
  nextEventId?: string;
}

export type GamePhase = 'childhood' | 'adolescence' | 'young_adult' | 'adult' | 'middle_age' | 'senior';

export interface GameConstants {
  MAX_STAT_VALUE: number;
  MIN_STAT_VALUE: number;
  STARTING_STAT_POINTS: number;
  MAX_AGE: number;
  MIN_AGE: number;
  PHASE_RANGES: Record<GamePhase, { min: number; max: number }>;
}