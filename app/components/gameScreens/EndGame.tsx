// components/EndGame.tsx
import React from "react";
import { useAppSelector } from "@/app/store/constants/reduxTypes";
import Leaderboard from "../Leaderboard";

const EndGame: React.FC = () => {
  const game = useAppSelector((state) => state.game);

  return (
    <div className="flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-background-light bauhaus-border p-8 text-center">
        <h1 className="text-6xl font-black text-text-primary mb-4 uppercase tracking-widest">Game Over</h1>
        <p className="text-2xl font-bold text-text-primary mb-8 uppercase">Thanks for playing!</p>
        <div className="text-left">
          <Leaderboard players={game.players} />
        </div>
      </div>
    </div>
  );
};

export default EndGame;
