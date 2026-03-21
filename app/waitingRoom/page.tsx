"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import { setGame, addPlayer, setCurrentQuestion } from "../store/slices/gameSlice";

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
    console.log("Waiting Room mounted");
    console.log("socketID: ", socketID);
    console.log("Player: ", player);
    if (socketID && player.name) {
      // reinitialize socket
      const socket = initSocket(socketID, playerId);
      console.log("Socket: ", socket);
      setIsLoading(false);

      // check for game updates
      console.log("Requesting game update", game.code);
      socket.emit("requestGameUpdate", game.code);

      // if code is valid
      socket.on("gameUpdate", (data: { game: Game; action?: string }) => {
        const { game } = data;
        dispatch(setGame(game));
        if (game.gameActive) {
          router.push(`/game`);
        }
      });

      // if code is invalid
      socket.once("gameNotActive", () => {
        console.log("Game no longer active");
        alert("Game no longer active");
        router.push("/");
      });

      // add Player
      socket.on("addPlayer", (player: Player) => {
        console.log("Player added: ", player);
        dispatch(addPlayer(player));
      });

      // listener for acknocledgement of backend
      socket.once("gameStarted", (question: string) => {
        dispatch(setCurrentQuestion(question));
        // redirect to game page
        router.push(`/game`);
      });

      // Cleanup function
      return () => {
        socket.off("gameUpdate");
        socket.off("gameNotActive");
        socket.off("addPlayer");
        socket.off("gameStarted");
      };
    } else {
      router.push("/");
    }
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleStartClick = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("startGame");
  };

  const handleShareLink = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}?code=${game.code}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 4000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleCopyGameCode = () => {
    navigator.clipboard
      .writeText(game.code.toString())
      .then(() => {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy game code: ", err);
      });
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4 font-sans">
      <div className="bauhaus-card bg-accent p-8 w-full max-w-md">
        <h1 className="text-4xl font-black mb-8 text-text-primary text-center uppercase tracking-wider border-b-4 border-text-primary pb-4">
          Waiting Room
        </h1>
        <div className="mb-8 text-center bg-background-light bauhaus-border p-4 relative cursor-pointer group" onClick={handleCopyGameCode}>
          <p className="text-xl font-bold text-text-primary uppercase mb-2">Game Code:</p>
          <p className="text-5xl font-black text-primary tracking-widest">
            {game.code}
          </p>
          <span
            className={`absolute -top-10 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-text-primary text-background-light font-bold uppercase text-sm transition-opacity duration-300 ${codeCopied ? "opacity-100" : "opacity-0"}`}
          >
            COPIED!
          </span>
          <p className="text-sm text-text-primary font-bold mt-2 uppercase">Click to copy</p>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-text-primary text-center uppercase">
          Welcome, {player.name}!
        </h2>

        <div className="mb-8 bg-background-light bauhaus-border p-4">
          <PlayersList />
        </div>

        {player.isHost ? (
          <button
            onClick={handleStartClick}
            className="w-full bg-secondary text-background-light py-4 px-6 bauhaus-button text-xl mb-6 hover:bg-secondary-dark"
          >
            START GAME
          </button>
        ) : (
          <p className="text-lg text-text-primary font-bold text-center mb-6 uppercase bg-background-light bauhaus-border p-4">
            Waiting for host to start...
          </p>
        )}

        <button
          onClick={handleShareLink}
          className={`w-full py-4 px-6 bauhaus-button text-xl uppercase ${
            linkCopied ? "bg-primary text-background-light" : "bg-background-light text-text-primary hover:bg-gray-200"
          }`}
        >
          {linkCopied ? "LINK COPIED!" : "SHARE LINK"}
        </button>
      </div>
    </div>
  );
}
