"use client";

import React from "react";
import { useAppSelector } from "@/app/store/constants/reduxTypes";
import Leaderboard from "../Leaderboard";

const EndGame: React.FC = () => {
  const game = useAppSelector((state) => state.game);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <h1 className="heading-display text-3xl text-gray-800 mb-2 text-center anim-fade-up" style={{ fontStyle: "italic" }}>Game Over</h1>
      <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-8">Thanks for playing!</p>

      <div className="w-full max-w-2xl anim-fade-up">
        <Leaderboard players={game.players} />
      </div>
    </div>
  );
};

export default EndGame;
