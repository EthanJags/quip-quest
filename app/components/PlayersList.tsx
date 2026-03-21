import React, { useEffect } from "react";
import { useAppSelector } from "../store/constants/reduxTypes";

export default function PlayersList() {
  const players = useAppSelector((state) => state.game.players);

  useEffect(() => {
    console.log("PlayersList mounted");
    console.log(players);
    return () => {
      console.log("PlayersList unmounted");
    };
  });

  if (players === undefined) {
    return <div className="text-center text-text-primary font-bold uppercase border-4 border-text-primary p-4">No players yet</div>;
  }

  const playerArray = Object.values(players);

  return (
    <div className="w-full font-sans">
      <h2 className="text-2xl font-black mb-4 text-text-primary uppercase tracking-wide border-b-4 border-text-primary pb-2">Players</h2>
      <ul className="bg-background-light border-4 border-text-primary">
        {playerArray.map((player, index) => (
          <li
            key={player.id}
            className={`px-4 py-3 flex items-center justify-between ${
              index !== playerArray.length - 1 ? "border-b-4 border-text-primary" : ""
            }`}
          >
            <span className="text-text-primary font-bold text-lg uppercase">{player.name}</span>
            {player.isHost && <span className="ml-2 px-2 py-1 bg-primary text-background-light text-xs font-black uppercase border-2 border-text-primary">HOST</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
