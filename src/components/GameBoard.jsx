// src/components/GameBoard.jsx
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import PlayingCard from './PlayingCard';
import PlayerHand from './PlayerHand';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./ui/alert-dialog";

const GameBoard = ({ 
  gameState, 
  onDefenderPlay, 
  onAttackerPlay, 
  onEndRound,
  onNewGame 
}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const isDefender = gameState.currentDefender === 1;
  
  // Handle card selection from player's hand
  const handleCardClick = useCallback((index) => {
    if (isDefender) {
      // Defender logic
      if (gameState.defenderCards.length === 0) {
        // Playing face-up card
        onDefenderPlay(index, true);
        setSelectedCard(null);
      } else {
        // Playing face-down card
        onDefenderPlay(index, false);
        setSelectedCard(null);
      }
    } else {
      // Attacker logic
      setSelectedCard(prev => prev === index ? null : index);
    }
  }, [isDefender, gameState.defenderCards.length, onDefenderPlay]);

  // Handle clicking on defender's cards for attack
  const handleDefenderCardClick = useCallback((targetIndex) => {
    if (!isDefender && selectedCard !== null) {
      onAttackerPlay(selectedCard, targetIndex);
      setSelectedCard(null);
    }
  }, [isDefender, selectedCard, onAttackerPlay]);

  return (
    <div className="min-h-screen bg-green-800 p-4">
      {/* Game info header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-white">
          <span className="font-bold">Current Turn: </span>
          {isDefender ? "Defender" : "Attacker"}
        </div>
        <div className="text-white">
          <span className="font-bold">Cards in Deck: </span>
          {gameState.deckCount}
        </div>
      </div>

      {/* Trump Card */}
      <div className="flex justify-center mb-8">
        <Card className="p-4 bg-white/10">
          <h3 className="text-white text-center mb-2">Trump Card</h3>
          {gameState.trumpCard && (
            <PlayingCard
              card={gameState.trumpCard}
              disabled
              className="transform rotate-90"
            />
          )}
        </Card>
      </div>

      {/* Opponent's Hand */}
      <div className="mb-8">
        <PlayerHand
          cards={Array(gameState.opponentCardCount).fill({ faceDown: true })}
          isActive={false}
          isDefender={!isDefender}
        />
      </div>

      {/* Playing Area */}
      <Card className="bg-green-700/50 p-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          {/* Defender's Area */}
          <div>
            <h3 className="text-white text-center mb-2">Defender's Cards</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {gameState.defenderCards.map((card, index) => (
                <PlayingCard
                  key={`defender-${index}`}
                  card={card}
                  onClick={() => handleDefenderCardClick(index)}
                  disabled={isDefender || selectedCard === null}
                />
              ))}
            </div>
          </div>

          {/* Attacker's Area */}
          <div>
            <h3 className="text-white text-center mb-2">Attacker's Cards</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {gameState.attackerCards.map((card, index) => (
                <PlayingCard
                  key={`attacker-${index}`}
                  card={card}
                  disabled
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Player's Hand */}
      <div className="mb-4">
        <PlayerHand
          cards={gameState.playerHand}
          onCardClick={handleCardClick}
          selectedCard={selectedCard}
          isActive={true}
          isDefender={isDefender}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onEndRound}
          disabled={gameState.defenderCards.length === 0}
          variant="secondary"
        >
          End Round
        </Button>
        <Button
          onClick={onNewGame}
          variant="destructive"
        >
          New Game
        </Button>
      </div>

      {/* Game Over Dialog */}
      <AlertDialog open={gameState.gameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Game Over!</AlertDialogTitle>
            <AlertDialogDescription>
              {gameState.winner === 1 ? "Player 1" : "Player 2"} wins!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={onNewGame}>
              Play Again
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Card Selection Helper */}
      {selectedCard !== null && !isDefender && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 rounded-lg px-4 py-2 text-sm text-gray-800">
            Select a defender's card to attack
          </div>
        </div>
      )}
    </div>
  );
};

GameBoard.propTypes = {
  gameState: PropTypes.shape({
    trumpCard: PropTypes.shape({
      suit: PropTypes.string,
      value: PropTypes.number,
      id: PropTypes.string
    }),
    currentDefender: PropTypes.number.isRequired,
    defenderCards: PropTypes.arrayOf(PropTypes.shape({
      suit: PropTypes.string,
      value: PropTypes.number,
      id: PropTypes.string
    })).isRequired,
    attackerCards: PropTypes.arrayOf(PropTypes.shape({
      suit: PropTypes.string,
      value: PropTypes.number,
      id: PropTypes.string
    })).isRequired,
    playerHand: PropTypes.arrayOf(PropTypes.shape({
      suit: PropTypes.string,
      value: PropTypes.number,
      id: PropTypes.string
    })).isRequired,
    opponentCardCount: PropTypes.number.isRequired,
    deckCount: PropTypes.number.isRequired,
    gameOver: PropTypes.bool.isRequired,
    winner: PropTypes.number
  }).isRequired,
  onDefenderPlay: PropTypes.func.isRequired,
  onAttackerPlay: PropTypes.func.isRequired,
  onEndRound: PropTypes.func.isRequired,
  onNewGame: PropTypes.func.isRequired
};

export default GameBoard;