"use client";

import React from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../store/constants/reduxTypes";
import PlayerBalloon from "./PlayerBalloon";

interface PlayerInfoProps {
  players: Game["players"];
  socket: Socket;
  currentPlayerId: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ players, socket, currentPlayerId }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentPlayer = useAppSelector((state) => state.player);

  const handleKickPlayer = (playerId: string) => {
    socket.emit("kickPlayer", playerId);
  };

  return (
    <div>
      <h2 className="heading-display text-2xl text-gray-800 mb-6" style={{ fontStyle: "italic" }}>Players</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className="flex flex-col items-center">
            <PlayerBalloon
              player={player}
              size="md"
              showScore
              showHost
              animationDelay={`${index * 0.2}s`}
            />
            {currentPlayer.isHost && currentPlayer.id !== player.id && (
              <button
                onClick={() => handleKickPlayer(player.id)}
                className="h-7 px-3 rounded-full text-[10px] font-medium border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-[0.97] cursor-pointer mt-1"
              >
                Kick
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerInfo;
