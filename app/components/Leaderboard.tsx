import React from "react";

const Leaderboard: React.FC<{ players: Game["players"] }> = ({ players }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="p-6 font-sans">
      <h2 className="text-3xl font-black text-text-primary mb-6 uppercase tracking-widest border-b-4 border-text-primary pb-2">Leaderboard</h2>
      <ul className="space-y-4">
        {sortedPlayers.map((player, index) => (
          <li
            key={player.id}
            className={`flex items-center justify-between p-4 bauhaus-border ${
              index === 0 ? "bg-accent" : index === 1 ? "bg-gray-300" : index === 2 ? "bg-orange-300" : "bg-background-light"
            }`}
          >
            <div className="flex items-center">
              <span
                className={`w-10 h-10 flex items-center justify-center border-4 border-text-primary mr-4 font-black text-xl ${
                  index === 0
                    ? "bg-background-light text-text-primary"
                    : index === 1
                      ? "bg-background-light text-text-primary"
                      : index === 2
                        ? "bg-background-light text-text-primary"
                        : "bg-primary text-background-light"
                }`}
              >
                {index + 1}
              </span>
              <span className="font-bold text-xl text-text-primary uppercase">{player.name}</span>
            </div>
            <span className="font-black text-2xl text-text-primary">{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
