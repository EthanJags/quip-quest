"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import { setGame, addPlayer } from "../store/slices/gameSlice";

export default function WaitingRoom() {
  const router = useRouter();
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const game = useSelector((state: RootState) => state.game);
  const socketID = useSelector((state: RootState) => state.socket.id);
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const playerId = useSelector((state: RootState) => state.player.id);

  useEffect(() => {
    if (socketID && player.name) {
      const socket = initSocket(socketID, playerId);
      setIsLoading(false);

      socket.emit("requestGameUpdate", game.code);

      socket.on("gameUpdate", (data: { game: Game; action?: string }) => {
        const { game } = data;
        dispatch(setGame(game));
        if (game.gameActive) router.push(`/game`);
      });

      socket.once("gameNotActive", () => {
        alert("Game no longer active");
        router.push("/");
      });

      socket.on("addPlayer", (player: Player) => {
        dispatch(addPlayer(player));
      });

      return () => {
        socket.off("gameUpdate");
        socket.off("gameNotActive");
        socket.off("addPlayer");
      };
    } else {
      router.push("/");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-6 h-6 border-2 border-yellow anim-pulse-geo" />
      </div>
    );
  }

  const handleStartClick = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("startGame");
  };

  const handleShareLink = () => {
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}?code=${game.code}`).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 4000);
    });
  };

  const handleCopyGameCode = () => {
    navigator.clipboard.writeText(game.code.toString()).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* Title */}
      <div className="relative z-10 text-center mb-6 anim-fade-up">
        <h1 className="heading-display text-5xl md:text-7xl text-gray-900" style={{ fontStyle: "italic" }}>
          Waiting Room
        </h1>
      </div>

      {/* Game Code */}
      <div className="relative z-10 text-center mb-8 anim-fade-up">
        <p className="text-gray-900/50 text-xs font-medium tracking-widest uppercase mb-3">Game Code</p>
        <button onClick={handleCopyGameCode} className="relative group cursor-pointer block mx-auto">
          <p className="font-mono text-6xl font-bold text-gray-900 tracking-[0.15em] group-hover:text-gray-700 transition-colors duration-200">
            {game.code}
          </p>
          <p className="text-gray-900/40 text-xs font-medium tracking-widest uppercase mt-2">
            {codeCopied ? "Copied!" : "Tap to copy"}
          </p>
        </button>
      </div>

      {/* Content area */}
      <div className="w-full max-w-sm relative z-10 anim-fade-up space-y-3">
        {/* Players list — no card, balloons float freely */}
        <PlayersList />

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          {player.isHost ? (
            <div className="flex gap-2.5">
              <button
                onClick={handleShareLink}
                className={`flex-1 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all active:scale-[0.98] cursor-pointer ${
                  linkCopied
                    ? "bg-gray-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                    : "bg-white text-gray-900 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
                }`}
              >
                {linkCopied ? "link copied!" : "share link"}
              </button>
              <button onClick={handleStartClick} className="flex-1 py-3.5 rounded-full bg-gray-900 text-white text-sm font-medium tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer">
                start game
              </button>
            </div>
          ) : (
            <>
              <p className="text-white/70 text-xs font-medium tracking-widest uppercase text-center py-2">
                Waiting for host to start
              </p>
              <button
                onClick={handleShareLink}
                className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all active:scale-[0.98] cursor-pointer ${
                  linkCopied
                    ? "bg-gray-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                    : "bg-white text-gray-900 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
                }`}
              >
                {linkCopied ? "link copied!" : "share link"}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full py-2 text-gray-900/50 text-xs font-medium tracking-widest uppercase hover:text-red-500 transition-colors cursor-pointer"
        >
          leave game
        </button>
      </div>
    </div>
  );
}
