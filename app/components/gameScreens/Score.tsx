"use client";

import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector, useAppDispatch } from "@/app/store/constants/reduxTypes";
import { setCurrentStage, incrementRound } from "@/app/store/slices/gameSlice";
import Leaderboard from "../Leaderboard";

const Score: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const players = useAppSelector((state) => state.game.players);
  const player = useAppSelector((state) => state.player);
  const currentRound = useAppSelector((state) => state.game.currentRound);
  const maxRounds = useAppSelector((state) => state.game.gameSettings.rounds);
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          dispatch(incrementRound());
          if (currentRound < maxRounds) {
            handleStartRound();
          } else {
            dispatch(setCurrentStage("End"));
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, currentRound, maxRounds]);

  const handleStartRound = () => {
    socket.emit("nextRound");
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="w-full max-w-2xl">
        <Leaderboard players={players} />

        <div className="mt-8 text-center">
          {player.isHost && (
            <button
              className="mt-8 py-3.5 px-8 rounded-full bg-gray-900 text-white text-sm font-medium tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer"
              onClick={handleStartRound}
            >
              start next round
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Score;
