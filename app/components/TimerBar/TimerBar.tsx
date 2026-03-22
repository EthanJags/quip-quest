"use client";

import React from "react";
import { useAppSelector } from "@/app/store/constants/reduxTypes";

interface TimerBarProps {
  timeRemaining: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ timeRemaining }) => {
  const game = useAppSelector((state) => state.game);

  const getTotalTime = (stage: string): number => {
    switch (stage) {
      case "Answering":
        return game.gameSettings.timePerQuestion;
      case "Voting":
        return game.gameSettings.timePerVote;
      case "Results":
        return game.gameSettings.timePerResults;
      case "Score":
        return game.gameSettings.timePerScore;
      default:
        return 0;
    }
  };

  const totalTime = getTotalTime(game.currentStage);
  const percentageRemaining = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;

  return (
    <div className="h-2.5 bg-white/40 rounded-full overflow-hidden relative">
      <div
        className="h-full bg-gray-800 rounded-full transition-all duration-1000"
        style={{ width: `${percentageRemaining}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[9px] font-bold text-white drop-shadow-sm">
          {Math.ceil(timeRemaining)}s
        </span>
      </div>
    </div>
  );
};

export default TimerBar;
