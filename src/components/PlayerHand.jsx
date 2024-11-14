// src/components/PlayerHand.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { cn } from "../lib/utils";
import PlayingCard from './PlayingCard';

const PlayerHand = ({ 
  cards = [], 
  onCardClick, 
  selectedCard = null,
  isActive = false,
  isDefender = false,
  className
}) => {
  // Calculate the overlap between cards based on hand size
  const getOverlap = (numCards) => {
    if (numCards <= 5) return 'translate-x-0';
    // Increase overlap as more cards are added
    const overlap = Math.min((numCards - 5) * 10, 50);
    return `-translate-x-${overlap}`;
  };

  return (
    <div className={cn(
      "relative w-full p-4",
      "flex flex-col items-center gap-2",
      className
    )}>
      {/* Player role indicator */}
      <div className={cn(
        "px-3 py-1 rounded-full text-sm font-medium",
        "transition-colors duration-200",
        isDefender 
          ? "bg-blue-500 text-white" 
          : "bg-red-500 text-white"
      )}>
        {isDefender ? "Defender" : "Attacker"}
      </div>

      {/* Cards container */}
      <div className={cn(
        "relative w-full",
        "flex justify-center items-center",
        "min-h-[200px] perspective-1000"
      )}>
        {/* Active player indicator */}
        {isActive && (
          <div className={cn(
            "absolute -inset-2",
            "rounded-lg",
            "border-2 border-yellow-400",
            "animate-pulse"
          )} />
        )}

        {/* Cards */}
        <div className="flex items-center justify-center">
          {cards.map((card, index) => (
            <div
              key={card.id || `card-${index}`}
              className={cn(
                "transition-transform duration-200 ease-out",
                "hover:-translate-y-4",
                getOverlap(cards.length),
                // Add margin to all cards except the last one
                index !== cards.length - 1 && "mr-[-60px]"
              )}
              style={{
                // Add slight rotation to each card
                transform: `rotate(${(index - cards.length / 2) * 2}deg)`,
                zIndex: index
              }}
            >
              <PlayingCard
                card={card}
                onClick={() => onCardClick?.(index)}
                selected={selectedCard === index}
                faceDown={card.faceDown}
                disabled={!isActive}
                className="shadow-md hover:shadow-xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Card count */}
      <div className={cn(
        "absolute bottom-0 right-4",
        "px-2 py-1 rounded-full",
        "bg-gray-800 text-white",
        "text-sm font-medium"
      )}>
        {cards.length} cards
      </div>

      {/* Empty hand message */}
      {cards.length === 0 && (
        <div className={cn(
          "absolute inset-0",
          "flex items-center justify-center",
          "text-gray-500 text-lg font-medium"
        )}>
          No cards in hand
        </div>
      )}
    </div>
  );
};

PlayerHand.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      suit: PropTypes.string,
      value: PropTypes.number,
      faceDown: PropTypes.bool
    })
  ),
  onCardClick: PropTypes.func,
  selectedCard: PropTypes.number,
  isActive: PropTypes.bool,
  isDefender: PropTypes.bool,
  className: PropTypes.string
};

PlayerHand.defaultProps = {
  cards: [],
  selectedCard: null,
  isActive: false,
  isDefender: false
};

export default PlayerHand;