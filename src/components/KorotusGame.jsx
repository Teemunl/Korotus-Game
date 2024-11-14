// src/components/KorotusGame.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  initializeGame, 
  playDefenderCard, 
  playAttackerCard, 
  resolveRound 
} from '../game/GameLogic';
import GameBoard from './GameBoard';
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const KorotusGame = () => {
  const [gameState, setGameState] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showRules, setShowRules] = useState(false);
  const { toast } = useToast();

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  // Start new game
  const startNewGame = useCallback(() => {
    const newGameState = initializeGame();
    setGameState(newGameState);
    setGameHistory([]);
    
    toast({
      title: "New Game Started",
      description: "Good luck!",
      duration: 2000,
    });
  }, [toast]);

  // Save state to history before each move
  const saveStateToHistory = useCallback((state) => {
    setGameHistory(prev => [...prev, state]);
  }, []);

  // Undo last move
  const undoLastMove = useCallback(() => {
    if (gameHistory.length === 0) {
      toast({
        title: "Cannot Undo",
        description: "No moves to undo!",
        variant: "destructive",
      });
      return;
    }

    const previousState = gameHistory[gameHistory.length - 1];
    setGameState(previousState);
    setGameHistory(prev => prev.slice(0, -1));
  }, [gameHistory, toast]);

  // Handle defender playing a card
  const handleDefenderPlay = useCallback((cardIndex, isFaceUp) => {
    if (!gameState) return;

    saveStateToHistory(gameState);

    try {
      const newState = playDefenderCard(gameState, cardIndex, isFaceUp);
      setGameState(newState);

      // Check if defender needs to play more face-down cards
      const faceUpCard = newState.defenderCards[0];
      if (faceUpCard && isFaceUp) {
        const neededCards = Math.min(
          faceUpCard.value,
          newState.playerHand.length
        );
        
        if (neededCards > 0) {
          toast({
            title: "Play Face Down Cards",
            description: `You need to play ${neededCards} more cards`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Invalid Move",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [gameState, toast, saveStateToHistory]);

  // Handle attacker playing a card
  const handleAttackerPlay = useCallback((cardIndex, targetIndex) => {
    if (!gameState) return;

    saveStateToHistory(gameState);

    try {
      const newState = playAttackerCard(gameState, cardIndex, targetIndex);
      setGameState(newState);
    } catch (error) {
      toast({
        title: "Invalid Move",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [gameState, toast, saveStateToHistory]);

  // Handle ending the current round
  const handleEndRound = useCallback(() => {
    if (!gameState) return;

    saveStateToHistory(gameState);

    const newState = resolveRound(gameState);
    setGameState(newState);

    if (newState.gameOver) {
      toast({
        title: "Game Over!",
        description: `Player ${newState.winner} wins!`,
        duration: 5000,
      });
    } else {
      toast({
        title: "Round Ended",
        description: `${newState.currentDefender === 1 ? "Player 1" : "Player 2"} is now defending`,
      });
    }
  }, [gameState, toast, saveStateToHistory]);

  // Rules dialog content
  const RulesContent = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Korotus Rules</CardTitle>
        <CardDescription>A two-player card game</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-bold mb-2">Setup</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>The game uses cards 1-10 in each suit</li>
            <li>Each player starts with 10 cards</li>
            <li>One card is turned face up as the trump card</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Card Strength</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>Defender's trump value is strongest</li>
            <li>Trump suit beats non-trump suits</li>
            <li>Higher value beats lower value in same suit</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Playing a Turn</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>Defender plays one face-up card</li>
            <li>Defender must add face-down cards equal to the face-up value</li>
            <li>Attacker tries to beat each defender card</li>
            <li>Winner of each pair takes both cards</li>
          </ul>
        </div>
        <Button 
          onClick={() => setShowRules(false)}
          className="w-full mt-4"
        >
          Close Rules
        </Button>
      </CardContent>
    </Card>
  );

  if (!gameState) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowRules(true)}
        >
          Rules
        </Button>
        <Button
          variant="outline"
          onClick={undoLastMove}
          disabled={gameHistory.length === 0}
        >
          Undo
        </Button>
      </div>

      {showRules && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <RulesContent />
        </div>
      )}

      <GameBoard
        gameState={gameState}
        onDefenderPlay={handleDefenderPlay}
        onAttackerPlay={handleAttackerPlay}
        onEndRound={handleEndRound}
        onNewGame={startNewGame}
      />
    </div>
  );
};

export default KorotusGame;