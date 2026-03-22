"use client";

import React from "react";
import { useAppSelector } from "../store/constants/reduxTypes";
import PlayerBalloon from "./PlayerBalloon";

export default function PlayersList() {
  const players = useAppSelector((state) => state.game.players);
  const currentPlayerId = useAppSelector((state) => state.player.id);

  if (players === undefined) {
    return <div className="label-caps text-text-muted text-center">No players yet</div>;
  }

  const playerArray = Object.values(players);

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-4">
        {playerArray.map((player, index) => (
          <PlayerBalloon
            key={player.id}
            player={player}
            size="md"
            showHost
            isYou={player.id === currentPlayerId}
            animationDelay={`${index * 0.3}s`}
          />
        ))}
      </div>
    </div>
  );
}
