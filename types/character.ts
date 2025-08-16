export interface CharacterStats {
  health: number;
  happiness: number;
  intelligence: number;
  wealth: number;
  social: number;
}

export interface Character {
  id?: string;
  name: string;
  age: number;
  stats: CharacterStats;
  createdAt?: Date;
  lastPlayedAt?: Date;
  completedEvents?: string[];
}

export interface CharacterCreationForm {
  name: string;
  stats: CharacterStats;
  remainingPoints: number;
}

export type StatType = keyof CharacterStats;

export interface StatChange {
  type: StatType;
  value: number;
  reason?: string;
}

export interface CharacterHistory {
  characterId: string;
  events: Array<{
    eventId: string;
    choiceIndex: number;
    statChanges: StatChange[];
    timestamp: Date;
    age: number;
  }>;
}