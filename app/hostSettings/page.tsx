"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import { setGame, addPlayer, resetGame } from "../store/slices/gameSlice";

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

  useEffect(() => {
    if (socketID && player.isHost && player.name) {
      initSocket(socketID, playerID);
      setIsLoading(false);
    } else {
      router.push("/");
    }
  }, [player.name, socketID, player.isHost, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleStartClick = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("createGame", gameSettings, player);
    dispatch(resetGame());

    // add loading state
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
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4 font-sans">
      <div className="bauhaus-card bg-background-light p-8 w-full max-w-md">
        <h1 className="text-3xl font-black mb-6 text-text-primary text-center uppercase border-b-4 border-text-primary pb-2">
          Host Settings
        </h1>
        <h2 className="text-xl font-bold mb-6 text-text-primary uppercase text-center">
          Welcome, {player.name}!
        </h2>

        <div className="space-y-6">
          {Object.entries(gameSettings).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="mb-2 text-sm font-black text-text-primary uppercase tracking-wide">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}:
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
                className="w-full px-4 py-3 bauhaus-input text-lg font-bold uppercase cursor-pointer"
              >
                {settingOptions[key as keyof typeof settingOptions].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {!loadingCreateGame ? (
          <button
            onClick={handleStartClick}
            className="w-full mt-8 bg-primary text-background-light py-4 px-6 bauhaus-button text-xl hover:bg-primary-dark"
          >
            CREATE GAME
          </button>
        ) : (
          <button
            disabled
            className="w-full mt-8 bg-gray-400 text-background-light py-4 px-6 bauhaus-button text-xl cursor-not-allowed"
          >
            CREATING GAME...
          </button>
        )}
      </div>
    </div>
  );
}
