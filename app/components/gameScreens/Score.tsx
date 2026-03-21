import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector, useAppDispatch } from "@/app/store/constants/reduxTypes";
import { setCurrentStage, incrementRound, setGame } from "@/app/store/slices/gameSlice";
import Leaderboard from "../Leaderboard";
import { useSocketEvent } from "@/app/functions/useSocketEvent";

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
            // emit next round
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

  const handleStartRound = () => () => {
    socket.emit("nextRound");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 font-sans">
      <div className="w-full max-w-2xl bg-background-light bauhaus-border p-8">
        <h1 className="text-5xl font-black text-center text-text-primary mb-8 uppercase tracking-widest border-b-4 border-text-primary pb-4">Scores</h1>
        <Leaderboard players={players} />
        <div className="mt-12 text-center">
          <p className="text-2xl font-bold text-text-primary uppercase">
            Next round starting in <span className="font-black text-primary">{timeLeft}</span> seconds
          </p>
          <div className="mt-6 w-full bg-background-light bauhaus-border h-8 relative">
            <div
              className="bg-primary h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            ></div>
          </div>
          {player.isHost && (
            <button
              className="mt-8 w-full bg-secondary text-background-light py-4 px-6 bauhaus-button text-xl hover:bg-secondary-dark uppercase"
              onClick={handleStartRound()}
            >
              START NEXT ROUND
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Score;
