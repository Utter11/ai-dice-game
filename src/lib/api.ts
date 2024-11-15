interface GameData {
  playerName: string;
  rolls: Array<{
    die1: number;
    die2: number;
    sum: number;
    rollNumber: number;
  }>;
  totalScore: number;
}

interface GameData {
  playerName: string;
  rolls: Array<{
    die1: number;
    die2: number;
    sum: number;
    rollNumber: number;
  }>;
  totalScore: number;
}

export const saveGame = async (gameData: GameData) => {
  // Implement your save logic here
  // Example:
  const response = await fetch('/api/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData),
  });
  return response.json();
}; 