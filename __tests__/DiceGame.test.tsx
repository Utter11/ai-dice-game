import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DiceGame from '@/components/DiceGame';
import { useGameStore } from '@/lib/store';
import userEvent from '@testing-library/user-event';

// Mock the store
jest.mock('@/lib/store', () => ({
  useGameStore: jest.fn()
}));

// Mock the server action
jest.mock('@/lib/actions', () => ({
  saveGame: jest.fn()
}));

describe('DiceGame', () => {
  const mockStore = {
    playerName: '',
    rolls: [],
    isGameOver: false,
    setPlayerName: jest.fn(),
    addRoll: jest.fn(),
    resetGame: jest.fn(),
  };
  beforeEach(() => {
    (useGameStore as unknown as jest.Mock).mockImplementation(() => mockStore);
  });

  it('renders player name input when no name is set', () => {
    render(<DiceGame />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('shows game interface after setting player name', () => {
    const mockStoreWithName = {
      ...mockStore,
      playerName: 'Test Player'
    };
    (useGameStore as unknown as jest.Mock).mockImplementation(() => mockStoreWithName);

    render(<DiceGame />);
    expect(screen.getByText('Player: Test Player')).toBeInTheDocument();
    expect(screen.getByText('Rolls remaining: 3')).toBeInTheDocument();
  });

  it('handles dice rolling', async () => {
    const mockStoreWithName = {
      ...mockStore,
      playerName: 'Test Player',
      addRoll: jest.fn()
    };
    (useGameStore as unknown as jest.Mock).mockImplementation(() => mockStoreWithName);

    render(<DiceGame />);
    
    const rollButton = screen.getByText('Roll Dice');
    fireEvent.click(rollButton);

    await waitFor(() => {
      expect(mockStoreWithName.addRoll).toHaveBeenCalled();
    });
  });

  it('displays game over state after three rolls', () => {
    const mockStoreWithRolls = {
      ...mockStore,
      playerName: 'Test Player',
      rolls: [
        { die1: 3, die2: 4, sum: 7, rollNumber: 1 },
        { die1: 5, die2: 2, sum: 7, rollNumber: 2 },
        { die1: 4, die2: 3, sum: 7, rollNumber: 3 }
      ],
      isGameOver: true
    };
    (useGameStore as unknown as jest.Mock).mockImplementation(() => mockStoreWithRolls);

    render(<DiceGame />);
    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    expect(screen.getByText('Total Score: 21')).toBeInTheDocument();
  });

  it('should disable roll button while rolling', async () => {
    const mockStoreWithName = {
      ...mockStore,
      playerName: 'Test Player'
    };
    (useGameStore as unknown as jest.Mock).mockImplementation(() => mockStoreWithName);

    render(<DiceGame />);
    const rollButton = screen.getByText('Roll Dice');
    
    fireEvent.click(rollButton);
    expect(rollButton).toBeDisabled();
    expect(screen.getByText('Rolling...')).toBeInTheDocument();
  });

  it('should handle error states during save', async () => {
    // Mock a failed save
    jest.mock('../services/gameService', () => ({
      saveGame: jest.fn()
    }));
    const { saveGame } = require('../services/gameService');
    (saveGame as jest.Mock).mockRejectedValue(new Error('Save failed'));
    
    const mockStoreWithTwoRolls = {
      ...mockStore,
      playerName: 'Test Player',
      rolls: [
        { die1: 1, die2: 2, sum: 3, rollNumber: 1 },
        { die1: 3, die2: 4, sum: 7, rollNumber: 2 }
      ]
    };
    
    (useGameStore as unknown as jest.Mock).mockImplementation(() => mockStoreWithTwoRolls);

    render(<DiceGame />);
    // Test error handling
  });

  it('should handle complete game flow', async () => {
    const user = userEvent.setup();
    render(<DiceGame />);

    // Enter name
    await user.type(screen.getByPlaceholderText('Enter your name'), 'Player 1{enter}');
    
    // Complete three rolls
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByText('Roll Dice'));
      // Wait for roll animation
      await waitFor(() => {
        expect(screen.getByText(`Roll ${i + 1}`)).toBeInTheDocument();
      });
    }

    // Verify game over state
    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    
    // Test new game
    await user.click(screen.getByText('Play Again'));
    expect(screen.getByText('Rolls remaining: 3')).toBeInTheDocument();
  });

  it('handles player name submission', async () => {
    render(<DiceGame />);
    const input = screen.getByPlaceholderText('Enter your name');
    const submitButton = screen.getByText('Start Game');
    
    await userEvent.type(input, 'Test Player');
    await userEvent.click(submitButton);
    
    expect(mockStore.setPlayerName).toHaveBeenCalledWith('Test Player');
  });

  it('should reset rolling state when starting new game', async () => {
    const mockStoreWithRolls = {
      ...mockStore,
      playerName: 'Test Player',
      rolls: [
        { die1: 3, die2: 4, sum: 7, rollNumber: 1 },
        { die1: 5, die2: 2, sum: 7, rollNumber: 2 },
        { die1: 4, die2: 3, sum: 7, rollNumber: 3 }
      ],
      isGameOver: true
    };
    
    (useGameStore as unknown as jest.Mock).mockImplementation(() => mockStoreWithRolls);

    render(<DiceGame />);
    
    // Click roll button to set isRolling to true
    const rollButton = screen.getByText('Roll Dice');
    fireEvent.click(rollButton);
    
    // Click Play Again
    const playAgainButton = screen.getByText('Play Again');
    fireEvent.click(playAgainButton);
    
    // Verify the roll button is enabled and shows correct text
    const newRollButton = screen.getByText('Roll Dice');
    expect(newRollButton).not.toBeDisabled();
    expect(newRollButton).not.toHaveTextContent('Rolling...');
  });
});
