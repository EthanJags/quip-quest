"use client";

import React from "react";

interface PlayerBalloonProps {
  player: Player;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
  showHost?: boolean;
  isYou?: boolean;
  animationDelay?: string;
  className?: string;
}

const SIZES = {
  sm: { balloon: 130, nameText: "text-[11px]", scoreText: "text-[9px]" },
  md: { balloon: 160, nameText: "text-xs", scoreText: "text-[10px]" },
  lg: { balloon: 200, nameText: "text-sm", scoreText: "text-xs" },
};

const PlayerBalloon: React.FC<PlayerBalloonProps> = ({
  player,
  size = "md",
  showScore = false,
  showHost = false,
  isYou = false,
  animationDelay = "0s",
  className = "",
}) => {
  const s = SIZES[size];

  return (
    <div
      className={`flex flex-col items-center anim-float ${className}`}
      style={{ animationDelay, animationDuration: "6s" }}
    >
      {/* Balloon with name — cropped to hide string */}
      <div className="relative overflow-hidden" style={{ width: s.balloon, height: s.balloon * 0.85 }}>
        <img
          src="/balloon.png"
          alt=""
          className="w-full object-contain object-top drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          style={{ height: s.balloon * 1.21 }}
          draggable={false}
        />
        {/* Name pill centered on balloon face */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: s.balloon * 0.12 }}>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
            <p className={`font-bold text-gray-800 ${s.nameText} truncate max-w-[80px] text-center uppercase tracking-wide`}>
              {player.name}
            </p>
          </div>
        </div>
      </div>

      {/* Badges below balloon */}
      <div className="text-center -mt-1 flex items-center justify-center gap-1">
        {isYou && showHost && player.isHost ? (
          <span className="bg-gray-900 text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full inline-block">
            You · Host
          </span>
        ) : (
          <>
            {isYou && (
              <span className="bg-gray-900 text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full inline-block">
                You
              </span>
            )}
            {showHost && player.isHost && (
              <span className="bg-yellow text-bg px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full inline-block">
                Host
              </span>
            )}
          </>
        )}
        {showScore && (
          <p className={`font-mono font-bold text-text-muted ${s.scoreText} mt-0.5`}>
            {player.score} pts
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayerBalloon;
