// src/game/GameLogic.js
import { Suit } from './types';

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    this.id = `${suit}-${value}`;
  }

  toJSON() {
    return {
      suit: this.suit,
      value: this.value,
      id: this.id
    };
  }
}

class GameState {
  constructor() {
    this.deck = [];
    this.player1Hand = [];
    this.player2Hand = [];
    this.trumpCard = null;
    this.currentDefender = 1;
    this.defenderCards = [];
    this.attackerCards = [];
    this.discarded = [];
    this.gameOver = false;
    this.winner = null;
  }

  getCurrentPlayerHand() {
    return this.currentDefender === 1 ? this.player1Hand : this.player2Hand;
  }

  getAttackerHand() {
    return this.currentDefender === 1 ? this.player2Hand : this.player1Hand;
  }

  toJSON() {
    return {
      trumpCard: this.trumpCard?.toJSON(),
      currentDefender: this.currentDefender,
      defenderCards: this.defenderCards.map(c => c.toJSON()),
      attackerCards: this.attackerCards.map(c => c.toJSON()),
      playerHand: this.getCurrentPlayerHand().map(c => c.toJSON()),
      opponentCardCount: this.getAttackerHand().length,
      deckCount: this.deck.length,
      gameOver: this.gameOver,
      winner: this.winner
    };
  }
}

// Create and export the game functions
export function initializeGame() {
  const state = new GameState();
  
  // Create deck
  for (const suit of Object.values(Suit)) {
    for (let value = 1; value <= 10; value++) {
      state.deck.push(new Card(suit, value));
    }
  }
  
  // Shuffle deck
  for (let i = state.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];
  }
  
  // Deal initial cards
  for (let i = 0; i < 10; i++) {
    state.player1Hand.push(state.deck.pop());
    state.player2Hand.push(state.deck.pop());
  }
  
  // Draw trump card
  state.trumpCard = state.deck.pop();
  
  return state.toJSON();
}

export function compareCards(defenderCard, attackerCard, trumpCard) {
  // Rule 1: Defender's trump value always wins
  if (defenderCard.value === trumpCard.value) {
    return true;
  }

  // Rule 2: Trump suit comparison
  const isDefenderTrump = defenderCard.suit === trumpCard.suit;
  const isAttackerTrump = attackerCard.suit === trumpCard.suit;

  if (isDefenderTrump && !isAttackerTrump) {
    return true;
  }
  if (!isDefenderTrump && isAttackerTrump) {
    return false;
  }

  // Rule 3: Same suit comparison
  if (defenderCard.suit === attackerCard.suit) {
    return defenderCard.value > attackerCard.value;
  }

  // Rule 4: Different non-trump suits - defender loses
  return false;
}

export function playDefenderCard(gameState, cardIndex, isFaceUp = false) {
  const state = new GameState();
  Object.assign(state, gameState);

  const hand = state.getCurrentPlayerHand();
  if (cardIndex < 0 || cardIndex >= hand.length) {
    throw new Error("Invalid card index");
  }

  if (isFaceUp && state.defenderCards.length > 0) {
    throw new Error("Face-up card can only be played first");
  }

  const playedCard = hand.splice(cardIndex, 1)[0];
  state.defenderCards.push(playedCard);

  if (isFaceUp) {
    const neededCards = Math.min(playedCard.value, hand.length);
    if (hand.length < neededCards) {
      throw new Error(`Need ${neededCards} more cards for face-down plays`);
    }
  }

  return state.toJSON();
}

export function playAttackerCard(gameState, cardIndex, targetIndex) {
  const state = new GameState();
  Object.assign(state, gameState);

  const hand = state.getAttackerHand();
  if (cardIndex < 0 || cardIndex >= hand.length) {
    throw new Error("Invalid card index");
  }

  if (targetIndex < 0 || targetIndex >= state.defenderCards.length) {
    throw new Error("Invalid target index");
  }

  if (state.attackerCards[targetIndex]) {
    throw new Error("Position already attacked");
  }

  const playedCard = hand.splice(cardIndex, 1)[0];

  while (state.attackerCards.length <= targetIndex) {
    state.attackerCards.push(null);
  }
  state.attackerCards[targetIndex] = playedCard;

  return state.toJSON();
}

export function resolveRound(gameState) {
  const state = new GameState();
  Object.assign(state, gameState);

  state.defenderCards.forEach((defenderCard, index) => {
    const attackerCard = state.attackerCards[index];
    if (!attackerCard) {
      state.getCurrentPlayerHand().push(defenderCard);
      return;
    }

    const defenderWins = compareCards(defenderCard, attackerCard, state.trumpCard);
    if (defenderWins) {
      state.getCurrentPlayerHand().push(defenderCard);
      state.getCurrentPlayerHand().push(attackerCard);
    } else {
      state.getAttackerHand().push(defenderCard);
      state.getAttackerHand().push(attackerCard);
    }
  });

  state.defenderCards = [];
  state.attackerCards = [];

  if (state.deck.length > 0) {
    state.trumpCard = state.deck.pop();
  }

  state.currentDefender = state.currentDefender === 1 ? 2 : 1;

  if (state.player1Hand.length === 0) {
    state.gameOver = true;
    state.winner = 2;
  } else if (state.player2Hand.length === 0) {
    state.gameOver = true;
    state.winner = 1;
  }

  return state.toJSON();
}