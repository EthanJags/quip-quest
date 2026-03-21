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
    <div className="flex flex-col items-center">
      <p className="text-xl font-semibold text-gray-700 mb-4">Prompt: {question}</p>
      <DrawingCanvas onSubmit={handleSubmit} />
    </div>
  );
};

export default Answering;
