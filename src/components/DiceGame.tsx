'use client';

import React, { useState } from 'react';
import { useGameStore } from '../lib/store';
import { saveGame } from '../lib/api';

const getScoreMessage = (score: number) => {
  if (score >= 30) {
    return {
      title: '🌟 LEGENDARY! 🌟',
      message: 'You are a true Dice Master!',
      colorClasses: 'from-yellow-400 to-yellow-600'
    };
  } else if (score >= 25) {
    return {
      title: '🎯 Amazing Roll! 🎯',
      message: 'Outstanding performance!',
      colorClasses: 'from-green-400 to-emerald-500'
    };
  } else if (score >= 21) {
    return {
      title: '👏 Well Done! 👏',
      message: 'Above average score!',
      colorClasses: 'from-blue-400 to-blue-600'
    };
  } else if (score >= 15) {
    return {
      title: '😕 Almost There',
      message: 'Keep practicing, you can do better!',
      colorClasses: 'from-orange-400 to-orange-600'
    };
  } else {
    return {
      title: '😢 Tough Luck',
      message: 'The dice were not in your favor today...',
      colorClasses: 'from-red-400 to-red-600'
    };
  }
};

export default function DiceGame() {
  const { 
    playerName, 
    rolls, 
    isGameOver, 
    addRoll, 
    resetGame, 
    setPlayerName,
    gameHistory,
    addToHistory 
  } = useGameStore();
  const [isRolling, setIsRolling] = useState(false);

  console.log('Current game history:', gameHistory);

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

    await new Promise(resolve => setTimeout(resolve, 800));
    
    addRoll(newRoll);
    setIsRolling(false);

    if (rolls.length === 2) {
      const allRolls = [...rolls, newRoll];
      const totalScore = allRolls.reduce((acc, roll) => acc + roll.sum, 0);
      
      const gameResult = {
        playerName,
        rolls: allRolls,
        totalScore: totalScore
      };
      
      console.log('Before adding to history:', gameHistory.length);
      addToHistory(gameResult);
      console.log('After adding to history:', gameHistory.length);
      
      await saveGame(gameResult);
    }
  };

  const totalScore = rolls.reduce((acc, roll) => acc + roll.sum, 0);

  return (
    <div className="space-y-6">
      {!playerName ? (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            Welcome to Dice Master!
          </h2>
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
              placeholder="Enter your name, challenger!"
              className="w-full p-3 rounded-lg bg-gray-700 text-white border-2 
                         border-transparent focus:border-yellow-400 transition-all
                         placeholder:text-gray-400 text-center text-lg"
              minLength={2}
              required
            />
            <button 
              type="submit"
              className="w-full mt-4 px-6 py-3 bg-yellow-500 rounded-lg 
                         hover:bg-yellow-400 transition-all transform hover:scale-105
                         font-bold text-black shadow-lg hover:shadow-yellow-500/50"
            >
              Begin Your Adventure!
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="text-center space-y-4 animate-fadeIn">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg inline-block">
              <p className="text-2xl font-bold text-yellow-400">Master {playerName}</p>
              <p className="text-lg mt-2">
                <span className="text-gray-400">Rolls remaining: </span>
                <span className="text-white font-bold">{3 - rolls.length}</span>
              </p>
            </div>
            <button
              onClick={rollDice}
              disabled={isGameOver || isRolling}
              className={`px-8 py-4 rounded-lg font-bold text-lg transform transition-all
                         ${isRolling ? 'animate-pulse bg-gray-600' : 
                           'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 hover:scale-105'}
                         disabled:bg-gray-600 disabled:cursor-not-allowed
                         shadow-lg hover:shadow-yellow-500/50 text-black`}
            >
              {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice!'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            {rolls.map((roll, index) => (
              <div key={index} 
                   className="bg-gray-800 p-6 rounded-lg text-center transform 
                             transition-all hover:scale-105 shadow-lg
                             animate-slideIn"
                   style={{ animationDelay: `${index * 200}ms` }}>
                <p className="text-xl font-bold text-yellow-400 mb-3">Roll {index + 1}</p>
                <div className="space-y-2">
                  <p className="text-3xl mb-2 text-white">
                    🎲 {roll.die1} + {roll.die2}
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 
                                text-transparent bg-clip-text">
                    = {roll.sum}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {isGameOver && (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="bg-gray-800 p-8 rounded-lg shadow-lg inline-block max-w-md">
                {(() => {
                  const scoreMessage = getScoreMessage(totalScore);
                  return (
                    <>
                      <h2 className={`text-3xl font-bold bg-gradient-to-r ${scoreMessage.colorClasses} 
                                     text-transparent bg-clip-text mb-2`}>
                        {scoreMessage.title}
                      </h2>
                      <p className="text-gray-400 mb-4">{scoreMessage.message}</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 
                                   text-transparent bg-clip-text mb-6">
                        Final Score: {totalScore}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">
                          {totalScore >= 21 ? 
                            "You've mastered the dice! Ready for another round?" :
                            "Don't give up! Everyone has rough games sometimes."}
                        </p>
                        <button
                          onClick={handleReset}
                          className={`px-8 py-4 bg-gradient-to-r 
                                     ${totalScore >= 21 ? 
                                       'from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500' : 
                                       'from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500'}
                                     rounded-lg transition-all transform hover:scale-105
                                     font-bold text-lg text-white shadow-lg
                                     hover:shadow-green-500/50`}
                        >
                          🎮 {totalScore >= 21 ? "Play Again!" : "Try Again!"}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {gameHistory.length > 0 ? (
            <div className="mt-8 animate-fadeIn border-2 border-red-500">
              <h3 className="text-2xl font-bold text-center mb-4 text-yellow-400">
                Session Leaderboard 🏆
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-4 shadow-lg backdrop-blur-sm">
                <div className="space-y-2">
                  {[...gameHistory]
                    .sort((a, b) => b.totalScore - a.totalScore)
                    .map((game, index) => (
                      <div 
                        key={game.timestamp.getTime()}
                        className="flex justify-between items-center p-3 rounded-lg bg-gray-700/50
                                  hover:bg-gray-600/50 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-yellow-400 font-bold">
                            #{index + 1}
                          </span>
                          <span className="text-white">
                            {game.playerName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-emerald-400 font-bold">
                            {game.totalScore} points
                          </span>
                          <span className="text-gray-400 text-sm">
                            {game.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 text-gray-400 text-center">
              No games completed yet
            </div>
          )}
        </>
      )}
    </div>
  );
} 