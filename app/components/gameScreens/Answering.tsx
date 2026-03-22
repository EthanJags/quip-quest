"use client";

import React from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";
import DrawingCanvas from "@/app/components/DrawingCanvas";

const Answering: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const prompt = useAppSelector((state) => state.game.currentPrompt);
  const currentPlayerId = useAppSelector((state) => state.player.id);

  const handleSubmit = (dataUrl: string) => {
    if (!socket) return;
    socket.emit("submitAnswer", { currentPlayerId, answer: dataUrl });
    dispatch(setCurrentStage("AwaitingResponses"));
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">Prompt</p>
      {prompt ? (
        <p className="text-xl font-semibold text-gray-800 mb-6 text-center">{prompt}</p>
      ) : (
        <p className="text-xl font-semibold text-gray-400 mb-6 text-center animate-pulse">Loading prompt...</p>
      )}
      <div className="h-px bg-gray-200/60 mb-6 w-full" />
      <DrawingCanvas onSubmit={handleSubmit} />
    </div>
  );
};

export default Answering;
