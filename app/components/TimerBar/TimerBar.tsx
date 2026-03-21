import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/store/constants/reduxTypes";

interface TimerBarProps {
  timeRemaining: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ timeRemaining }) => {
  const game = useAppSelector((state) => state.game);
  const [totalTime, setTotalTime] = useState<number>(0);

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

  useEffect(() => {
    setTotalTime(getTotalTime(game.currentStage));
  }, [game.currentStage]);

  const [interpolatedTime, setInterpolatedTime] = useState(timeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setInterpolatedTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const percentageRemaining = (interpolatedTime / totalTime) * 100;

  return (
    <div className="w-full h-10 bg-background-light bauhaus-border relative overflow-hidden">
      <div
        className="h-full bg-secondary transition-all duration-100 ease-linear"
        style={{ width: `${percentageRemaining}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-black text-text-primary uppercase mix-blend-difference">{Math.ceil(interpolatedTime)} SECONDS LEFT</span>
      </div>
    </div>
  );
};

export default TimerBar;
