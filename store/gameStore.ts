import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Character {
  name: string;
  age: number;
  stats: {
    health: number;
    happiness: number;
    intelligence: number;
    wealth: number;
    social: number;
  };
}

interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: Array<{
    text: string;
    effect: Record<string, number>;
  }>;
}

interface GameState {
  // Game state
  isGameStarted: boolean;
  isPaused: boolean;
  currentEventId: string | null;
  
  // Character
  character: Character | null;
  
  // Game progression
  completedEvents: string[];
  gameYear: number;
  
  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  
  // Actions
  startNewGame: (character: Character) => void;
  loadGame: () => void;
  saveGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  
  // Character actions
  updateCharacterStats: (statChanges: Partial<Character['stats']>) => void;
  ageCharacter: () => void;
  
  // Event actions
  setCurrentEvent: (eventId: string) => void;
  completeEvent: (eventId: string) => void;
  
  // Settings actions
  toggleSound: () => void;
  toggleMusic: () => void;
  
  // Reset
  resetGame: () => void;
}

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      isGameStarted: false,
      isPaused: false,
      currentEventId: null,
      character: null,
      completedEvents: [],
      gameYear: 0,
      soundEnabled: true,
      musicEnabled: true,
      
      // Game actions
      startNewGame: (character: Character) => set({
        isGameStarted: true,
        isPaused: false,
        character,
        completedEvents: [],
        gameYear: 0,
        currentEventId: null
      }),
      
      loadGame: () => {
        // Load game logic - data is automatically loaded by persist middleware
        console.log('Game loaded');
      },
      
      saveGame: () => {
        // Save game logic - data is automatically saved by persist middleware
        console.log('Game saved');
      },
      
      pauseGame: () => set({ isPaused: true }),
      
      resumeGame: () => set({ isPaused: false }),
      
      // Character actions
      updateCharacterStats: (statChanges) => set((state) => {
        if (!state.character) return state;
        
        const newStats = { ...state.character.stats };
        Object.entries(statChanges).forEach(([stat, change]) => {
          if (stat in newStats && typeof change === 'number') {
            newStats[stat as keyof typeof newStats] = Math.max(0, 
              Math.min(100, newStats[stat as keyof typeof newStats] + change)
            );
          }
        });
        
        return {
          character: {
            ...state.character,
            stats: newStats
          }
        };
      }),
      
      ageCharacter: () => set((state) => {
        if (!state.character) return state;
        
        return {
          character: {
            ...state.character,
            age: state.character.age + 1
          },
          gameYear: state.gameYear + 1
        };
      }),
      
      // Event actions
      setCurrentEvent: (eventId) => set({ currentEventId: eventId }),
      
      completeEvent: (eventId) => set((state) => ({
        completedEvents: [...state.completedEvents, eventId],
        currentEventId: null
      })),
      
      // Settings actions
      toggleSound: () => set((state) => ({ 
        soundEnabled: !state.soundEnabled 
      })),
      
      toggleMusic: () => set((state) => ({ 
        musicEnabled: !state.musicEnabled 
      })),
      
      // Reset
      resetGame: () => set({
        isGameStarted: false,
        isPaused: false,
        currentEventId: null,
        character: null,
        completedEvents: [],
        gameYear: 0
      })
    }),
    {
      name: 'life-line-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        character: state.character,
        completedEvents: state.completedEvents,
        gameYear: state.gameYear,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        isGameStarted: state.isGameStarted
      })
    }
  )
);

export default useGameStore;