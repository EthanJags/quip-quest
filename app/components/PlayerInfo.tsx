import React, { use } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../store/constants/reduxTypes";

interface PlayerInfoProps {
  players: Game["players"];
  socket: Socket;
  currentPlayerId: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ players, socket, currentPlayerId }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentPlayer = useAppSelector((state) => state.player);

  const handleKickPlayer = (playerId: string) => {
    socket.emit("kickPlayer", playerId);
  };

  return (
    <div className="bg-background-light bauhaus-border p-6 font-sans">
      <h2 className="text-3xl font-black text-text-primary mb-6 uppercase tracking-widest border-b-4 border-text-primary pb-2">Players</h2>
      <ul className="space-y-4">
        {sortedPlayers.map((player) => (
          <li
            key={player.id}
            className="flex items-center justify-between p-4 bauhaus-border bg-background-light"
          >
            <div className="flex items-center">
              <span className="font-bold text-xl text-text-primary uppercase">{player.name}</span>
              {player.isHost && <span className="ml-3 px-2 py-1 bg-primary text-background-light text-xs font-black uppercase border-2 border-text-primary">HOST</span>}
            </div>
            <div className="flex items-center">
              <span className="font-black text-2xl text-text-primary mr-4">{player.score}</span>
              {currentPlayer.isHost && currentPlayer.id !== player.id && (
                <button
                  onClick={() => handleKickPlayer(player.id)}
                  className="bg-primary text-background-light font-bold py-2 px-4 bauhaus-button text-sm hover:bg-primary-dark"
                >
                  KICK
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerInfo;
