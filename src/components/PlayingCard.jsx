// src/components/PlayingCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { cn } from "../lib/utils";

const PlayingCard = ({ 
  card, 
  onClick, 
  selected = false, 
  faceDown = false,
  disabled = false,
  className
}) => {
  const getSuitColor = (suit) => {
    if (!suit) return 'text-gray-800';
    return ['hearts', 'diamonds'].includes(suit) ? 'text-red-600' : 'text-gray-800';
  };

  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getValueDisplay = (value) => {
    switch (value) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      default: return value;
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // Card face content
  const CardContent = () => (
    <div className="relative w-full h-full">
      {/* Top left corner */}
      <div className={cn(
        "absolute top-2 left-2",
        "flex flex-col items-center",
        getSuitColor(card?.suit)
      )}>
        <div className="text-lg font-bold">{getValueDisplay(card?.value)}</div>
        <div className="text-xl">{getSuitSymbol(card?.suit)}</div>
      </div>

      {/* Center symbol */}
      <div className={cn(
        "absolute inset-0",
        "flex items-center justify-center",
        getSuitColor(card?.suit)
      )}>
        <div className="text-4xl">{getSuitSymbol(card?.suit)}</div>
      </div>

      {/* Bottom right corner (inverted) */}
      <div className={cn(
        "absolute bottom-2 right-2",
        "flex flex-col items-center transform rotate-180",
        getSuitColor(card?.suit)
      )}>
        <div className="text-lg font-bold">{getValueDisplay(card?.value)}</div>
        <div className="text-xl">{getSuitSymbol(card?.suit)}</div>
      </div>
    </div>
  );

  return (
    <div 
      className={cn(
        // Base styles
        "relative w-24 h-36 rounded-lg cursor-pointer",
        "transform transition-all duration-200",
        // Interactive states
        {
          "hover:scale-110": !disabled && !faceDown,
          "cursor-not-allowed opacity-75": disabled,
          "scale-105 ring-2 ring-blue-500": selected,
          "hover:-translate-y-2": !disabled
        },
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={selected}
    >
      {/* Card body */}
      <div className={cn(
        "absolute inset-0",
        "rounded-lg transition-transform duration-500",
        "transform-style-preserve-3d",
        faceDown && "rotate-y-180"
      )}>
        {/* Front face */}
        <div className={cn(
          "absolute inset-0",
          "bg-white rounded-lg",
          "flex items-center justify-center",
          "backface-hidden shadow-md"
        )}>
          <CardContent />
        </div>

        {/* Back face */}
        <div className={cn(
          "absolute inset-0",
          "bg-blue-600 rounded-lg",
          "transform rotate-y-180",
          "backface-hidden shadow-md",
          "flex items-center justify-center"
        )}>
          <div className="w-3/4 h-3/4 rounded border-2 border-white/30 flex items-center justify-center">
            <div className="text-white text-4xl">?</div>
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -inset-1 rounded-lg ring-2 ring-blue-500 pointer-events-none" />
      )}
    </div>
  );
};

PlayingCard.propTypes = {
  card: PropTypes.shape({
    suit: PropTypes.string,
    value: PropTypes.number,
    id: PropTypes.string
  }),
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  faceDown: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

PlayingCard.defaultProps = {
  selected: false,
  faceDown: false,
  disabled: false
};

export default PlayingCard;