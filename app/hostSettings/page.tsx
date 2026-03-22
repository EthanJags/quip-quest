"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import { setGame, addPlayer, resetGame } from "../store/slices/gameSlice";
import { setPlayerAvatar } from "../store/slices/playerSlice";
import { Avatar, AVATARS } from "../components/avatars";

export default function HostSettings() {
  const router = useRouter();
  const player = useAppSelector((state) => state.player);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCreateGame, setLoadingCreateGame] = useState(false);
  const socketID = useAppSelector((state) => state.socket.id);
  const playerID = useAppSelector((state) => state.player.id);
  const dispatch = useAppDispatch();

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    rounds: 5,
    timePerQuestion: 30,
    timePerVote: 20,
    timePerResults: 15,
    timePerScore: 10,
    promptDeck: "standard",
  });

  const settingOptions = {
    rounds: [3, 5, 7, 10],
    timePerQuestion: [30, 45, 60, 90, 120],
    timePerVote: [15, 20, 30, 45],
    timePerResults: [5, 10, 15, 20, 30],
    timePerScore: [5, 10, 15, 20, 30],
    promptDeck: ["Standard", "Family Friendly", "Adult"],
  };

  // Pick a random avatar if player doesn't have one
  const randomAvatar = useMemo(() => {
    const pick = AVATARS[Math.floor(Math.random() * AVATARS.length)].id;
    return pick;
  }, []);

  useEffect(() => {
    if (socketID && player.isHost && player.name) {
      initSocket(socketID, playerID);
      setIsLoading(false);
      if (!player.avatar) {
        dispatch(setPlayerAvatar(randomAvatar));
      }
    } else {
      router.push("/");
    }
  }, [player.name, socketID, player.isHost, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-6 h-6 border-2 border-blue anim-pulse-geo" />
      </div>
    );
  }

  const handleStartClick = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("createGame", gameSettings, player);
    dispatch(resetGame());
    setLoadingCreateGame(true);
    socket.once("gameCreated", (game) => {
      dispatch(setGame(game));
      dispatch(addPlayer(player));
      router.push(`/waitingRoom?code=${game.code}`);
    });
  };

  const handleSettingChange = (setting: keyof GameSettings, value: number | string) => {
    setGameSettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* Avatar + Name + Title */}
      <div className="relative z-10 text-center mb-6 anim-fade-up flex flex-col items-center">
        <Avatar avatarId={player.avatar || randomAvatar} size={72} className="mb-2 ring-2 ring-gray-900" />
        <p className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">
          {player.name}
        </p>
        <h1 className="heading-display text-5xl md:text-7xl text-gray-900" style={{ fontStyle: "italic" }}>
          Host Game
        </h1>
      </div>

      {/* Settings */}
      <div className="w-full max-w-sm relative z-10 anim-fade-up space-y-3">
        <p className="text-gray-900 text-xs font-medium tracking-widest uppercase text-center mb-1">Game Settings</p>

        {Object.entries(gameSettings).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} className="text-gray-900 text-xs font-medium tracking-widest uppercase mb-1.5 block px-1">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            <select
              id={key}
              value={value}
              onChange={(e) =>
                handleSettingChange(
                  key as keyof GameSettings,
                  key === "promptDeck" ? e.target.value : Number(e.target.value),
                )
              }
              className="w-full px-6 py-4 bg-pink rounded-full text-sm font-bold text-gray-900 uppercase tracking-widest border-2 border-dashed border-gray-900 focus:outline-none focus:border-gray-700 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231a1a2e' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1.25rem center" }}
            >
              {settingOptions[key as keyof typeof settingOptions].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="pt-2">
          <button
            onClick={handleStartClick}
            disabled={loadingCreateGame}
            className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all active:scale-[0.98] cursor-pointer ${
              loadingCreateGame
                ? "bg-white/40 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
            }`}
          >
            {loadingCreateGame ? "creating..." : "create game"}
          </button>
        </div>
      </div>
    </div>
  );
}
