// src/game/GameState.js
import { Suit } from './types';

export class Card {
  constructor(suit, value) {
    if (!Object.values(Suit).includes(suit)) {
      throw new Error(`Invalid suit: ${suit}`);
    }
    if (value < 1 || value > 10) {
      throw new Error(`Invalid value: ${value}`);
    }
    
    this.suit = suit;
    this.value = value;
    this.id = `${suit}-${value}`;
  }

  toString() {
    return `${this.value} of ${this.suit}`;
  }

  toJSON() {
    return {
      suit: this.suit,
      value: this.value,
      id: this.id
    };
  }

  static fromJSON(json) {
    return new Card(json.suit, json.value);
  }
}

export class GameState {
  constructor() {
    // Core game state
    this.deck = [];
    this.player1Hand = [];
    this.player2Hand = [];
    this.trumpCard = null;
    this.currentDefender = 1;
    this.defenderCards = [];
    this.attackerCards = [];
    this.discarded = [];
    
    // Game status
    this.gameOver = false;
    this.winner = null;
    this.round = 1;
    this.turnHistory = [];
    
    // Additional state for UI
    this.selectedCard = null;
    this.validMoves = [];
    this.message = "";
  }

  // Getters for current game state
  getCurrentPlayerHand() {
    return this.currentDefender === 1 ? this.player1Hand : this.player2Hand;
  }

  getAttackerHand() {
    return this.currentDefender === 1 ? this.player2Hand : this.player1Hand;
  }

  getCurrentPlayer() {
    return this.currentDefender;
  }

  getOpponentPlayer() {
    return this.currentDefender === 1 ? 2 : 1;
  }

  getDeckCount() {
    return this.deck.length;
  }

  getDiscardedCount() {
    return this.discarded.length;
  }

  // State modification methods
  addToHand(player, card) {
    if (player === 1) {
      this.player1Hand.push(card);
    } else {
      this.player2Hand.push(card);
    }
  }

  removeFromHand(player, cardIndex) {
    const hand = player === 1 ? this.player1Hand : this.player2Hand;
    if (cardIndex < 0 || cardIndex >= hand.length) {
      throw new Error("Invalid card index");
    }
    return hand.splice(cardIndex, 1)[0];
  }

  addDefenderCard(card) {
    this.defenderCards.push(card);
  }

  addAttackerCard(card, position) {
    while (this.attackerCards.length <= position) {
      this.attackerCards.push(null);
    }
    this.attackerCards[position] = card;
  }

  // Game state validation
  validateDefenderPlay(cardIndex, isFaceUp) {
    const hand = this.getCurrentPlayerHand();
    
    if (cardIndex < 0 || cardIndex >= hand.length) {
      throw new Error("Invalid card index");
    }

    if (isFaceUp && this.defenderCards.length > 0) {
      throw new Error("Face-up card can only be played first");
    }

    const card = hand[cardIndex];
    if (isFaceUp) {
      const neededCards = Math.min(card.value, hand.length - 1);
      if (hand.length - 1 < neededCards) {
        throw new Error(`Need ${neededCards} more cards for face-down plays`);
      }
    }

    return true;
  }

  validateAttackerPlay(cardIndex, targetIndex) {
    const hand = this.getAttackerHand();
    
    if (cardIndex < 0 || cardIndex >= hand.length) {
      throw new Error("Invalid card index");
    }

    if (targetIndex < 0 || targetIndex >= this.defenderCards.length) {
      throw new Error("Invalid target position");
    }

    if (this.attackerCards[targetIndex]) {
      throw new Error("Position already attacked");
    }

    return true;
  }

  // State management methods
  saveToHistory() {
    this.turnHistory.push(this.toJSON());
  }

  undo() {
    if (this.turnHistory.length === 0) {
      throw new Error("No moves to undo");
    }
    const previousState = this.turnHistory.pop();
    return GameState.fromJSON(previousState);
  }

  // Card comparison and game rules
  isCardStronger(card1, card2) {
    // Defender's trump value rule
    if (card1.value === this.trumpCard.value && this.defenderCards.includes(card1)) {
      return true;
    }

    // Trump suit rule
    if (card1.suit === this.trumpCard.suit && card2.suit !== this.trumpCard.suit) {
      return true;
    }
    if (card2.suit === this.trumpCard.suit && card1.suit !== this.trumpCard.suit) {
      return false;
    }

    // Same suit comparison
    if (card1.suit === card2.suit) {
      return card1.value > card2.value;
    }

    // Different non-trump suits
    return false;
  }

  // Serialization methods
  toJSON() {
    return {
      trumpCard: this.trumpCard?.toJSON(),
      currentDefender: this.currentDefender,
      defenderCards: this.defenderCards.map(c => c?.toJSON()),
      attackerCards: this.attackerCards.map(c => c?.toJSON()),
      playerHand: this.getCurrentPlayerHand().map(c => c.toJSON()),
      opponentCardCount: this.getAttackerHand().length,
      deckCount: this.deck.length,
      discardedCount: this.discarded.length,
      gameOver: this.gameOver,
      winner: this.winner,
      round: this.round,
      message: this.message,
      validMoves: this.validMoves,
      selectedCard: this.selectedCard
    };
  }

  static fromJSON(json) {
    const state = new GameState();
    
    if (json.trumpCard) {
      state.trumpCard = Card.fromJSON(json.trumpCard);
    }
    
    state.currentDefender = json.currentDefender;
    state.defenderCards = json.defenderCards.map(c => c ? Card.fromJSON(c) : null);
    state.attackerCards = json.attackerCards.map(c => c ? Card.fromJSON(c) : null);
    state.gameOver = json.gameOver;
    state.winner = json.winner;
    state.round = json.round;
    state.message = json.message;
    state.validMoves = json.validMoves;
    state.selectedCard = json.selectedCard;

    return state;
  }

  // Deep clone the state
  clone() {
    return GameState.fromJSON(this.toJSON());
  }

  // Debug helper
  toString() {
    return `Round ${this.round}, Defender: Player ${this.currentDefender}
Trump: ${this.trumpCard}
Defender Cards: ${this.defenderCards.join(', ')}
Attacker Cards: ${this.attackerCards.join(', ')}
Deck: ${this.deck.length} cards
Discarded: ${this.discarded.length} cards`;
  }
}