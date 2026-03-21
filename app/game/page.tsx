"use client";

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import Answering from "../components/gameScreens/Answering";
import AwaitingResponses from "../components/gameScreens/AwaitingResponses";
import { time } from "console";
import TimerBar from "../components/TimerBar/TimerBar";
import { resetGame, setCurrentStage, setGame } from "../store/slices/gameSlice";
import Voting from "../components/gameScreens/Voting";
import AwaitingVotes from "../components/gameScreens/AwaitingVotes";
import Score from "../components/gameScreens/Score";
import EndGame from "../components/gameScreens/EndGame";
import Results from "../components/gameScreens/Results";
import PlayerInfo from "../components/PlayerInfo";

export default function Game() {
  const router = useRouter();
  const player = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const game = useAppSelector((state) => state.game);
  const currentStage = useAppSelector((state) => state.game.currentStage);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  // const [totalTime, setTotalTime] = useState<number>(game.gameSettings.timePerQuestion);
  const socketID = useAppSelector((state) => state.socket.id);
  const playerId = useAppSelector((state) => state.player.id);
  const isHost = useAppSelector((state) => state.player.isHost);
  const [showPlayerInfo, setShowPlayerInfo] = useState(false);
  const [error, setError] = useState<string>("");
  const alertShown = useRef(false);

  useEffect(() => {
    if (socketID && game.code !== -1) {
      const socket = initSocket(socketID, playerId);
      console.log("Socket: ", socket);

      // check for game updates
      console.log("Requesting game update", game.code);
      socket.emit("requestGameUpdate", game.code);

      // if code is valid
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

      // if code is invalid
      socket.once("gameNotActive", () => {
        console.log("Game no longer active");
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

  useEffect(() => {
    console.log("current Stage: ", currentStage);
  }, [currentStage]);

  // TIMER LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            dispatch(setCurrentStage("AwaitingResponses"));
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, game.code]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
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
    if (!socket) return <div>Connecting...</div>;
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
        return <div>Unknown game stage</div>;
    }
  };

  const toggleShowPlayerInfo = () => {
    setShowPlayerInfo(!showPlayerInfo);
  };

  return (
    <div className="min-h-screen bg-background-light p-4 font-sans">
      {/* Game Info Header */}
      <div className="bauhaus-card bg-background-light p-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="border-4 border-text-primary p-2 bg-accent">
            <p className="font-black text-xl text-text-primary uppercase">{player.name}</p>
            <p className="font-bold text-lg text-text-primary uppercase">Score: {player.score}</p>
          </div>
          <div className="text-right border-4 border-text-primary p-2 bg-background-light">
            <p className="text-sm text-text-primary font-bold uppercase">Round</p>
            <p className="text-3xl font-black text-text-primary">
              {game.currentRound} / {game.gameSettings.rounds}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <TimerBar timeRemaining={timeRemaining} />
        </div>
      </div>

      {/* Game Content */}
      <div className="bauhaus-card bg-background-light p-8">
        {renderGameContent()}
        {error && <div className="mt-4 text-primary font-bold uppercase text-center">{error}</div>}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLeaveGame}
            className="bg-primary text-background-light py-3 px-6 bauhaus-button text-lg hover:bg-primary-dark"
          >
            {isHost ? "END GAME" : "LEAVE GAME"}
          </button>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button onClick={toggleShowPlayerInfo} className="bg-secondary text-background-light py-3 px-6 bauhaus-button text-lg">
          PLAYER INFO
        </button>
      </div>

      {showPlayerInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          <div className="bauhaus-card bg-background-light p-8 max-w-md w-full">
            <PlayerInfo players={game.players} socket={getSocket()!} currentPlayerId={playerId} />
            <button
              onClick={toggleShowPlayerInfo}
              className="w-full mt-6 bg-text-primary text-background-light py-3 px-4 bauhaus-button text-lg"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
