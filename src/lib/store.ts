import { create } from 'zustand'

interface Roll {
  die1: number;
  die2: number;
  sum: number;
  rollNumber: number;
}

interface GameResult {
  playerName: string;
  totalScore: number;
  timestamp: Date;
  rolls: Roll[];
}

interface GameState {
  playerName: string;
  rolls: Roll[];
  isGameOver: boolean;
  gameHistory: GameResult[];
  setPlayerName: (name: string) => void;
  addRoll: (roll: Roll) => void;
  resetGame: () => void;
  addToHistory: (result: Omit<GameResult, 'timestamp'>) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerName: '',
  rolls: [],
  isGameOver: false,
  gameHistory: [],
  setPlayerName: (name) => set({ playerName: name }),
  addRoll: (roll) => set((state) => {
    const newRolls = [...state.rolls, roll];
    return {
      rolls: newRolls,
      isGameOver: newRolls.length >= 3
    };
  }),
  resetGame: () => set({ 
    rolls: [], 
    isGameOver: false,
  }),
  addToHistory: (result) => 
    set((state) => ({
      gameHistory: [...state.gameHistory, { ...result, timestamp: new Date() }]
    })),
})); 