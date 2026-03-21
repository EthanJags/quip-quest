"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./store/constants/reduxTypes";
import { getSocket, initSocket } from "./functions/socketManager";
import { setPlayerIsHost, setPlayerName } from "./store/slices/playerSlice";
import { setGame } from "./store/slices/gameSlice";
import { useSocketEvent } from "./functions/useSocketEvent";
import { QuestionMarkBackground } from "./components/QuestionMarkBackground";
import FloatingQuipsBackground from "./components/FloatingQuipsBackground";


export default function Home() {
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const socketID = useAppSelector((state) => state.socket.id);
  const player = useAppSelector((state) => state.player);
  const [showRules, setShowRules] = useState<boolean>(false);
  const language = useAppSelector((state) => state.language);
  const socket = socketID ? getSocket() : null;

  const toggleRules = () => setShowRules(!showRules);

  // get code from URL for sharing link to room
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setCode(codeFromUrl);
    }
  }, [searchParams]);

  // check if socket is connected
  useEffect(() => {
    console.log("Socket: ", socket);
    console.log("socketID: ", socketID);
    if (!socket) {
      setError("Failed to connect to server. Please try again later.");
    } else {
      setError("");
    }
  }, [socket, socketID]);

  const handleValidCode = useCallback(
    (game: Game) => {
      setIsSubmitting(false);
      dispatch(setGame(game));
      router.push(`/waitingRoom?code=${game.code}`);
    },
    [dispatch, router],
  );

  const handleInvalidCode = useCallback(() => {
    setIsSubmitting(false);
    setError("Invalid code. Please try again.");
    setCode("");
  }, []);

  const handleNameTaken = useCallback(() => {
    setIsSubmitting(false);
    setError("This name is already taken. Please choose a different name.");
  }, []);

  useSocketEvent(socket, "validCode", handleValidCode);
  useSocketEvent(socket, "invalidCode", handleInvalidCode);
  useSocketEvent(socket, "nameTaken", handleNameTaken);

  function createPlayer({ isHost }: { isHost: boolean }) {
    dispatch(setPlayerName(name));
    dispatch(setPlayerIsHost(isHost));
  }

  const handleHostClick = () => {
    if (name === "") {
      setError("Please enter a name");
      return;
    }
    createPlayer({ isHost: true });
    router.push("/hostSettings");
  };

  const handleJoinClick = () => {
    if (name === "") {
      setError("Please enter a name");
      return;
    }
    if (code === "") {
      setError("Please enter a game code");
      return;
    }
    setError("");
    setIsSubmitting(true);
    createPlayer({ isHost: false });
    console.log("Code: ", code);
    console.log("Player: ", { ...player, name });
    socket?.emit("joinGame", { code, player: { ...player, name, isHost: false } });
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4 relative z-10 font-sans">
      <div className="text-center mb-12 p-8 bauhaus-card bg-accent">
        <h1 className="text-6xl font-black mb-4 text-text-primary uppercase tracking-widest">
          QuipQuest
        </h1>
        <p className="text-2xl font-bold text-text-primary uppercase">
          Where wit meets laughter
        </p>
      </div>
      <FloatingQuipsBackground />
      <div className="p-8 w-full max-w-md bauhaus-card bg-background-light relative z-20">
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ENTER YOUR NAME"
          className="w-full px-4 py-3 mb-6 bauhaus-input text-lg placeholder-text-placeholder"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ENTER GAME CODE"
          className="w-full px-4 py-3 mb-8 bauhaus-input text-lg placeholder-text-placeholder"
        />
        <div className="flex flex-col space-y-4 mb-6">
          <button
            onClick={handleHostClick}
            className="w-full bg-primary text-background-light py-4 px-6 bauhaus-button text-xl hover:bg-primary-dark"
          >
            Host Game
          </button>
          <button
            onClick={handleJoinClick}
            className={`w-full py-4 px-6 bauhaus-button text-xl text-background-light ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "JOINING..." : "JOIN GAME"}
          </button>
        </div>
        <button
          onClick={toggleRules}
          className="w-full bg-accent text-text-primary py-3 px-4 bauhaus-button hover:bg-yellow-400"
        >
          VIEW RULES
        </button>
        {error && <p className="mt-6 text-primary font-bold text-center uppercase">{error}</p>}
      </div>
  
      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          <div className="bauhaus-card bg-background-light p-8 max-w-md w-full">
            <h2 className="text-3xl font-black mb-6 text-text-primary uppercase border-b-4 border-text-primary pb-2">Rules</h2>
            <ul className="list-square pl-6 mb-8 text-text-primary font-bold space-y-2 text-lg">
              <li>Players take turns answering prompts.</li>
              <li>Vote for your favorite answers.</li>
              <li>Points are awarded based on votes.</li>
              <li>The player with the most points wins.</li>
            </ul>
            <button
              onClick={toggleRules}
              className="w-full bg-primary text-background-light py-3 px-4 bauhaus-button text-xl"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
