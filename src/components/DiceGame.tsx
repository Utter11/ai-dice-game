'use client';

import React, { useState } from 'react';
import { useGameStore } from '../lib/store';
import { saveGame } from '../lib/api';

export default function DiceGame() {
  const { playerName, rolls, isGameOver, addRoll, resetGame, setPlayerName } = useGameStore();
  const [isRolling, setIsRolling] = useState(false);

  const handleReset = () => {
    resetGame();
    setIsRolling(false);
  };

  const rollDice = async () => {
    if (rolls.length >= 3) return;
    
    setIsRolling(true);
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    
    const newRoll = {
      die1,
      die2,
      sum: die1 + die2,
      rollNumber: rolls.length + 1
    };

    addRoll(newRoll);

    if (rolls.length === 2) {
      await saveGame({
        playerName,
        rolls: [...rolls, newRoll],
        totalScore: [...rolls, newRoll].reduce((acc, roll) => acc + roll.sum, 0)
      });
    }
    
    setIsRolling(false);
  };

  const totalScore = rolls.reduce((acc, roll) => acc + roll.sum, 0);

  return (
    <div className="space-y-6">
      {!playerName ? (
        <div className="space-y-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            const input = e.target as HTMLFormElement;
            const nameInput = input.elements.namedItem('playerName') as HTMLInputElement;
            if (nameInput.value.trim()) {
              setPlayerName(nameInput.value.trim());
            }
          }}>
            <input
              type="text"
              name="playerName"
              placeholder="Enter your name"
              className="w-full p-2 rounded bg-gray-700 text-white"
              minLength={2}
              required
            />
            <button 
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Game
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="text-center space-y-4">
            <p className="text-xl">Player: {playerName}</p>
            <p>Rolls remaining: {3 - rolls.length}</p>
            <button
              onClick={rollDice}
              disabled={isGameOver || isRolling}
              className="px-6 py-3 bg-blue-600 rounded-lg disabled:bg-gray-600 
                         hover:bg-blue-700 transition-colors"
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {rolls.map((roll, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-lg font-bold">Roll {index + 1}</p>
                <p>🎲 {roll.die1} + {roll.die2}</p>
                <p className="text-xl text-green-400">= {roll.sum}</p>
              </div>
            ))}
          </div>

          {isGameOver && (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Game Over!</h2>
              <p className="text-3xl text-green-400">Total Score: {totalScore}</p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 
                           transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 