import React from "react";
import PlayerBalloon from "./PlayerBalloon";

const RANK_BADGES = ["🥇", "🥈", "🥉"];

const Leaderboard: React.FC<{ players: Game["players"] }> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div>
      <h2 className="heading-display text-2xl text-gray-800 mb-6 text-center" style={{ fontStyle: "italic" }}>Leaderboard</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className="flex flex-col items-center">
            {index < 3 && (
              <span className="text-2xl mb-1">{RANK_BADGES[index]}</span>
            )}
            <PlayerBalloon
              player={player}
              size={index === 0 ? "lg" : "md"}
              showScore
              animationDelay={`${index * 0.15}s`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
