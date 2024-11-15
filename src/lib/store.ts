import { create } from 'zustand'

interface Roll {
  die1: number;
  die2: number;
  sum: number;
  rollNumber: number;
}

interface GameState {
  playerName: string;
  rolls: Roll[];
  isGameOver: boolean;
  setPlayerName: (name: string) => void;
  addRoll: (roll: Roll) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerName: '',
  rolls: [],
  isGameOver: false,
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
})); 