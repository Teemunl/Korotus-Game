// src/utils/cardUtils.js
import { Suit, CARD_DISPLAY, ERROR_MESSAGES } from '../game/types';

/**
 * Get the path to the card's SVG image
 */
export const getCardImageUrl = (card) => {
  if (!card) return '/assets/cards/back.svg';
  return `/assets/cards/${card.suit}/${card.value}.svg`;
};

/**
 * Calculate card strength based on trump card and game rules
 */
export const calculateCardStrength = (card, trumpCard, isDefender = false) => {
  if (!card || !trumpCard) return 0;
  
  let strength = card.value;
  
  // Defender's trump value is strongest
  if (isDefender && card.value === trumpCard.value) {
    return 1000;
  }
  
  // Trump suit adds significant strength
  if (card.suit === trumpCard.suit) {
    strength += 100;
  }
  
  return strength;
};

/**
 * Compare two cards based on game rules
 */
export const compareCards = (card1, card2, trumpCard, isCard1Defender = false) => {
  const strength1 = calculateCardStrength(card1, trumpCard, isCard1Defender);
  const strength2 = calculateCardStrength(card2, trumpCard, false);
  
  return strength1 > strength2;
};

/**
 * Sort cards by suit and value
 */
export const sortCards = (cards, trumpCard = null) => {
  return [...cards].sort((a, b) => {
    // First sort by suit (trump suit first)
    if (trumpCard) {
      if (a.suit === trumpCard.suit && b.suit !== trumpCard.suit) return -1;
      if (b.suit === trumpCard.suit && a.suit !== trumpCard.suit) return 1;
    }
    
    // Then by suit order
    const suitOrder = [Suit.HEARTS, Suit.DIAMONDS, Suit.SPADES, Suit.CLUBS];
    const suitDiff = suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
    if (suitDiff !== 0) return suitDiff;
    
    // Finally by value (high to low)
    return b.value - a.value;
  });
};

/**
 * Get valid target positions for an attack
 */
export const getValidTargets = (defenderCards, attackerCards) => {
  return defenderCards.map((_, index) => {
    return !attackerCards[index];
  });
};

/**
 * Calculate optimal card overlap based on hand size
 */
export const calculateCardOverlap = (numCards, containerWidth = 800) => {
  const cardWidth = CARD_DISPLAY.CARD_WIDTH;
  const minOverlap = 30;
  const maxOverlap = 80;
  
  // Calculate how much we need to overlap
  const totalWidth = cardWidth * numCards;
  const overflow = totalWidth - containerWidth;
  
  if (overflow <= 0) return 0;
  
  // Calculate needed overlap
  const neededOverlap = overflow / (numCards - 1);
  return Math.min(Math.max(neededOverlap, minOverlap), maxOverlap);
};

/**
 * Calculate card rotation for fan effect
 */
export const calculateCardRotation = (index, totalCards) => {
  const maxRotation = 30;
  const centerIndex = (totalCards - 1) / 2;
  const rotation = (index - centerIndex) * (maxRotation / totalCards);
  return Math.max(Math.min(rotation, maxRotation), -maxRotation);
};

/**
 * Get card position styles for hand display
 */
export const getCardStyles = (index, totalCards, containerWidth) => {
  const overlap = calculateCardOverlap(totalCards, containerWidth);
  const rotation = calculateCardRotation(index, totalCards);
  const translateX = index * (CARD_DISPLAY.CARD_WIDTH - overlap);
  
  return {
    transform: `
      translateX(${translateX}px) 
      rotate(${rotation}deg)
    `,
    zIndex: index,
  };
};

/**
 * Validate card play based on game rules
 */
export const validateCardPlay = (card, targetCard, trumpCard, isDefenderPlay) => {
  if (!card) {
    throw new Error(ERROR_MESSAGES.INVALID_CARD);
  }
  
  if (isDefenderPlay) {
    // Defender validation logic
    if (targetCard) {
      const isStronger = compareCards(card, targetCard, trumpCard, true);
      if (!isStronger) {
        throw new Error(ERROR_MESSAGES.INVALID_MOVE);
      }
    }
    return true;
  } else {
    // Attacker validation logic
    if (!targetCard) {
      throw new Error(ERROR_MESSAGES.INVALID_TARGET);
    }
    return true;
  }
};

/**
 * Format card for display
 */
export const formatCard = (card) => {
  if (!card) return '';
  
  const valueMap = {
    1: 'A',
    11: 'J',
    12: 'Q',
    13: 'K'
  };
  
  const suitSymbols = {
    [Suit.HEARTS]: '♥',
    [Suit.DIAMONDS]: '♦',
    [Suit.SPADES]: '♠',
    [Suit.CLUBS]: '♣'
  };
  
  const value = valueMap[card.value] || card.value;
  const symbol = suitSymbols[card.suit];
  
  return `${value}${symbol}`;
};

/**
 * Get suggested move based on game state
 */
export const getSuggestedMove = (hand, targetCard, trumpCard, isDefender) => {
  const sortedHand = sortCards(hand, trumpCard);
  
  if (isDefender) {
    // Find the weakest card that can beat the target
    return sortedHand.find(card => 
      compareCards(card, targetCard, trumpCard, true)
    );
  } else {
    // Find the weakest card when attacking
    return sortedHand[sortedHand.length - 1];
  }
};

/**
 * Animation helpers for card movements
 */
export const cardAnimations = {
  flip: {
    initial: { rotateY: 0 },
    animate: { rotateY: 180 },
    transition: { duration: 0.6 }
  },
  deal: (index) => ({
    initial: { x: -300, y: -200, rotate: -45 },
    animate: { x: 0, y: 0, rotate: 0 },
    transition: { 
      duration: 0.5,
      delay: index * 0.1
    }
  }),
  hover: {
    scale: 1.1,
    y: -20,
    transition: { duration: 0.2 }
  }
};

export const isValidPlay = (card, gameState) => {
  try {
    validateCardPlay(
      card,
      gameState.targetCard,
      gameState.trumpCard,
      gameState.currentDefender === gameState.currentPlayer
    );
    return true;
  } catch {
    return false;
  }
};