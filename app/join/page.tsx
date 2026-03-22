"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import { resetGame, setGame } from "../store/slices/gameSlice";

export default function Join() {
  const router = useRouter();
  const player = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socketID = useAppSelector((state) => state.socket.id);
  const playerId = useAppSelector((state) => state.player.id);

  useEffect(() => {
    if (socketID && player.name) {
      const socket = initSocket(socketID, playerId);
      setIsLoading(false);
    } else {
      router.push("/");
    }

    const socket = getSocket();
    if (socket) {
      const handleValidCode = (game: Game) => {
        setIsSubmitting(false);
        dispatch(setGame(game));
        router.push(`/waitingRoom?code=${game.code}`);
      };
      const handleInvalidCode = () => {
        setIsSubmitting(false);
        setError("Invalid code. Please try again.");
        setCode("");
      };

      socket.off("validCode");
      socket.off("invalidCode");
      socket.on("validCode", handleValidCode);
      socket.on("invalidCode", handleInvalidCode);

      return () => {
        socket.off("validCode", handleValidCode);
        socket.off("invalidCode", handleInvalidCode);
      };
    }
  }, [player.name, dispatch, router, socketID]);

  const handleSubmit = () => {
    const socket = getSocket();
    if (!socket) return;
    setError("");
    setIsSubmitting(true);
    socket.emit("joinGame", { code, player });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-6 h-6 border-2 border-primary anim-pulse-geo" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* Title */}
      <div className="relative z-10 text-center mb-8 anim-fade-up">
        <h1 className="heading-display text-5xl md:text-7xl text-gray-900" style={{ fontStyle: "italic" }}>
          Join Game
        </h1>
        <p className="mt-3 text-xl text-white/90 font-medium tracking-wide drop-shadow-md">
          {player.name}
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-sm relative z-10 anim-fade-up space-y-3">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="game code"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-pink rounded-full text-sm font-bold text-gray-900 uppercase tracking-widest placeholder:text-gray-900/35 placeholder:font-bold placeholder:uppercase placeholder:tracking-widest border-2 border-dashed border-gray-900 focus:outline-none focus:border-gray-700 transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !code}
          className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all active:scale-[0.98] ${
            isSubmitting || !code
              ? "bg-white/40 text-gray-400 cursor-not-allowed"
              : "bg-gray-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 cursor-pointer"
          }`}
        >
          {isSubmitting ? "joining..." : "join game"}
        </button>

        {error && (
          <p className="text-red-100 bg-red-500/20 backdrop-blur-sm text-xs font-medium text-center py-2 px-4 rounded-full anim-fade-in">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
