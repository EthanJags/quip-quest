import React from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";
import DrawingCanvas from "@/app/components/DrawingCanvas";

const Answering: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const currentPlayerId = useAppSelector((state) => state.player.id);

  const handleSubmit = (dataUrl: string) => {
    if (!socket) return;
    socket.emit("submitAnswer", { currentPlayerId, answer: dataUrl });
    dispatch(setCurrentStage("AwaitingResponses"));
  };

  return (
    <div className="flex flex-col items-center w-full font-sans">
      <div className="bg-accent bauhaus-border p-4 mb-6 w-full text-center">
        <p className="text-2xl font-black text-text-primary uppercase tracking-wide">Prompt:</p>
        <p className="text-3xl font-bold text-text-primary">{question}</p>
      </div>
      <DrawingCanvas onSubmit={handleSubmit} />
    </div>
  );
};

export default Answering;
