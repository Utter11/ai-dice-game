import { saveGame } from '@/lib/api';

describe('API Functions', () => {
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
  });

  it('should successfully save game data', async () => {
    const mockGameData = {
      playerName: 'Test Player',
      rolls: [
        { die1: 1, die2: 2, sum: 3, rollNumber: 1 },
        { die1: 3, die2: 4, sum: 7, rollNumber: 2 },
        { die1: 5, die2: 6, sum: 11, rollNumber: 3 }
      ],
      totalScore: 21
    };

    const response = await saveGame(mockGameData);
    expect(global.fetch).toHaveBeenCalledWith('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockGameData)
    });
  });
}); 