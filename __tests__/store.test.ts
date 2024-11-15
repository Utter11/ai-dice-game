import { useGameStore } from '@/lib/store';

describe('Game Store', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('should initialize with default values', () => {
    const state = useGameStore.getState();
    expect(state.playerName).toBe('');
    expect(state.rolls).toHaveLength(0);
    expect(state.isGameOver).toBe(false);
  });

  it('should update player name', () => {
    const { setPlayerName } = useGameStore.getState();
    setPlayerName('Test Player');
    expect(useGameStore.getState().playerName).toBe('Test Player');
  });

  it('should handle adding rolls and game over state', () => {
    const { addRoll } = useGameStore.getState();
    
    addRoll({ die1: 1, die2: 2, sum: 3, rollNumber: 1 });
    expect(useGameStore.getState().isGameOver).toBe(false);
    
    addRoll({ die1: 3, die2: 4, sum: 7, rollNumber: 2 });
    expect(useGameStore.getState().isGameOver).toBe(false);
    
    addRoll({ die1: 5, die2: 6, sum: 11, rollNumber: 3 });
    expect(useGameStore.getState().isGameOver).toBe(true);
  });

  it('should reset game while keeping player name', () => {
    const { setPlayerName, addRoll, resetGame } = useGameStore.getState();
    
    // Set up game state
    setPlayerName('Test Player');
    addRoll({ die1: 1, die2: 2, sum: 3, rollNumber: 1 });
    addRoll({ die1: 3, die2: 4, sum: 7, rollNumber: 2 });
    addRoll({ die1: 5, die2: 6, sum: 11, rollNumber: 3 });
    
    // Reset game
    resetGame();
    
    // Verify state
    const state = useGameStore.getState();
    expect(state.playerName).toBe('Test Player'); // Name should be preserved
    expect(state.rolls).toHaveLength(0); // Rolls should be cleared
    expect(state.isGameOver).toBe(false); // Game should be ready to play
  });
}); 