// src/game/types.js

// Card Suits
export const Suit = {
  HEARTS: "hearts",
  SPADES: "spades",
  DIAMONDS: "diamonds",
  CLUBS: "clubs"
};

// Player Roles
export const Role = {
  DEFENDER: "defender",
  ATTACKER: "attacker"
};

// Game Phase
export const GamePhase = {
  SETUP: "setup",
  DEFENDER_PLAY: "defender_play",
  ATTACKER_PLAY: "attacker_play",
  ROUND_END: "round_end",
  GAME_OVER: "game_over"
};

// Move Types
export const MoveType = {
  FACE_UP: "face_up",
  FACE_DOWN: "face_down",
  ATTACK: "attack",
  END_ROUND: "end_round"
};

// Game Events
export const GameEvent = {
  CARD_PLAYED: "card_played",
  ROUND_ENDED: "round_ended",
  GAME_OVER: "game_over",
  TRUMP_CHANGED: "trump_changed",
  ERROR: "error"
};

// Constants for game rules
export const GAME_CONSTANTS = {
  INITIAL_HAND_SIZE: 10,
  MIN_CARD_VALUE: 1,
  MAX_CARD_VALUE: 10,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 2
};

// Card display settings
export const CARD_DISPLAY = {
  CARD_WIDTH: 120,
  CARD_HEIGHT: 180,
  CARD_RADIUS: 10,
  COLORS: {
    RED: "#FF0000",
    BLACK: "#000000",
    CARD_BACK: "#1E40AF"
  }
};

// Helper functions
export const isRedSuit = (suit) => {
  return suit === Suit.HEARTS || suit === Suit.DIAMONDS;
};

export const getCardColor = (suit) => {
  return isRedSuit(suit) ? CARD_DISPLAY.COLORS.RED : CARD_DISPLAY.COLORS.BLACK;
};

export const getSuitSymbol = (suit) => {
  switch (suit) {
    case Suit.HEARTS: return "♥";
    case Suit.SPADES: return "♠";
    case Suit.DIAMONDS: return "♦";
    case Suit.CLUBS: return "♣";
    default: return "";
  }
};

export const formatCardName = (card) => {
  return `${card.value} ${getSuitSymbol(card.suit)}`;
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_CARD: "Invalid card value or suit",
  INVALID_MOVE: "Invalid move",
  WRONG_TURN: "Not your turn",
  GAME_OVER: "Game is already over",
  NOT_ENOUGH_CARDS: "Not enough cards to play",
  POSITION_TAKEN: "Position already taken",
  INVALID_TARGET: "Invalid target position",
  FACE_UP_FIRST: "Must play face-up card first"
};

// Event messages
export const EVENT_MESSAGES = {
  ROUND_START: "Round {round} started",
  ROUND_END: "Round {round} ended",
  GAME_OVER: "Game over! Player {winner} wins!",
  CARD_PLAYED: "{player} played {card}",
  TRUMP_CHANGED: "New trump card: {card}",
  NEED_FACE_DOWN: "Need to play {count} face-down cards"
};