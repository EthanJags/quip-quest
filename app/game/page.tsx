"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import Answering from "../components/gameScreens/Answering";
import AwaitingResponses from "../components/gameScreens/AwaitingResponses";
import TimerBar from "../components/TimerBar/TimerBar";
import { resetGame, setGame } from "../store/slices/gameSlice";
import Voting from "../components/gameScreens/Voting";
import AwaitingVotes from "../components/gameScreens/AwaitingVotes";
import Score from "../components/gameScreens/Score";
import EndGame from "../components/gameScreens/EndGame";
import Results from "../components/gameScreens/Results";

export default function Game() {
  const router = useRouter();
  const player = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const game = useAppSelector((state) => state.game);
  const currentStage = useAppSelector((state) => state.game.currentStage);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const socketID = useAppSelector((state) => state.socket.id);
  const playerId = useAppSelector((state) => state.player.id);
  const isHost = useAppSelector((state) => state.player.isHost);
  const [error, setError] = useState<string>("");
  const alertShown = useRef(false);

  useEffect(() => {
    if (socketID && game.code !== -1) {
      const socket = initSocket(socketID, playerId);

      socket.emit("requestGameUpdate", game.code);

      socket.on("gameUpdate", (data: { game: Game; action?: string }) => {
        const { game, action } = data;
        if (action === "resetAnsweringTimer") {
          setError("Not enough answers, timer has been reset, must have at least 2 submissions.");
        } else {
          setError("");
        }
        dispatch(setGame(game));
        if (!game.gameActive) {
          console.log("Game no longer active");
        }
        setIsLoading(false);
      });

      socket.once("gameNotActive", () => {
        alert("Game no longer active");
        router.push("/");
      });
    } else {
      if (!alertShown.current) {
        alert("No socket ID or game code");
        alertShown.current = true;
      }
      router.push("/");
    }
  }, [socketID]);

  // Count down locally from server's timeRemaining
  useEffect(() => {
    setTimeRemaining(game.timeRemaining);

    if (game.timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [game.timeRemaining, game.currentStage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-6 h-6 border-2 border-primary anim-pulse-geo" />
      </div>
    );
  }

  const handleLeaveGame = () => {
    const socket = getSocket();
    if (!socket) return;
    if (window.confirm(`Are you sure you want to ${isHost ? "end" : "leave"} the game?`)) {
      socket.emit("leaveGame", { playerId: player.id });
      dispatch(resetGame());
      router.push("/");
    }
  };

  const renderGameContent = () => {
    const socket = getSocket();
    if (!socket) return <div className="text-text-muted">Connecting...</div>;
    switch (currentStage) {
      case "Answering":
        return <Answering socket={socket} />;
      case "AwaitingResponses":
        return <AwaitingResponses socket={socket} />;
      case "Voting":
        return <Voting socket={socket} />;
      case "AwaitingVotes":
        return <AwaitingVotes socket={socket} />;
      case "Results":
        return <Results socket={socket} />;
      case "Score":
        return <Score socket={socket} />;
      case "End":
        return <EndGame />;
      default:
        return <div className="text-text-muted">Unknown game stage</div>;
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 relative overflow-hidden">

      {/* Game Header Bar */}
      <div className="max-w-[200px] mx-auto bg-white/80 backdrop-blur-md rounded-xl border border-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.06)] px-3 py-2 mb-3 anim-fade-up relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-xs text-gray-800">{player.name}</p>
            <p className="text-[9px] font-medium tracking-wider uppercase text-gray-400">Score: {player.score}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-medium tracking-wider uppercase text-gray-400">Round</p>
            <p className="font-mono text-sm font-bold text-gray-800">
              {game.currentRound}/{game.gameSettings.rounds}
            </p>
          </div>
        </div>
      </div>

      {/* Timer Bar - between header and content */}
      <div className="max-w-[200px] mx-auto px-2 mb-3 anim-fade-up relative z-10">
        <TimerBar timeRemaining={timeRemaining} />
      </div>

      {/* Game Content */}
      <div className="anim-fade-up relative z-10">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_2px_16px_rgba(0,0,0,0.06)] px-5 py-6">
          {renderGameContent()}
          {error && (
            <p className="text-red-100 bg-red-500/20 backdrop-blur-sm text-xs font-medium text-center py-2 px-4 rounded-full mt-4 anim-fade-in">
              {error}
            </p>
          )}
        </div>

        <button
          onClick={handleLeaveGame}
          className={`w-full pb-2 text-gray-900/50 text-xs font-medium tracking-widest uppercase hover:text-red-500 transition-colors cursor-pointer ${isHost ? "pt-6" : "pt-2"}`}
        >
          {isHost ? "end game" : "leave game"}
        </button>
      </div>

    </div>
  );
}
