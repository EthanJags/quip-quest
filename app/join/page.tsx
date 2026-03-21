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
    console.log("socketID: ", socketID);
    if (socketID && player.name) {
      const socket = initSocket(socketID, playerId);
      console.log("Socket: ", socket);
      console.log("Player: ", player);
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
    console.log("Code: ", code);
    console.log("Player: ", player);
    socket.emit("joinGame", { code, player });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4 font-sans">
      <div className="bauhaus-card bg-background-light p-8 w-full max-w-md">
        <h1 className="text-3xl font-black mb-8 text-text-primary text-center uppercase tracking-widest border-b-4 border-text-primary pb-2">
          Welcome, {player.name}!
        </h1>
        <div className="space-y-6">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="codeInput"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ENTER GAME CODE"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bauhaus-input text-lg placeholder-text-placeholder uppercase"
          />
          <button
            onClick={handleSubmit}
            className={`w-full py-4 px-6 bauhaus-button text-xl uppercase ${
              isSubmitting || code.length === 0
                ? "bg-gray-400 text-text-primary cursor-not-allowed"
                : "bg-secondary text-background-light hover:bg-secondary-dark"
            }`}
            disabled={isSubmitting || code.length === 0}
          >
            {isSubmitting ? "JOINING..." : "JOIN GAME"}
          </button>
        </div>
        {error && <p className="mt-6 text-primary font-bold text-center uppercase">{error}</p>}
      </div>
    </div>
  );
}
