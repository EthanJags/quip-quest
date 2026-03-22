"use client";

import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { useSocketEvent } from "@/app/functions/useSocketEvent";
import { setAnswers, setCurrentStage } from "@/app/store/slices/gameSlice";

const AwaitingResponses: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const prompt = useAppSelector((state) => state.game.currentPrompt);
  const [answersRecieved, setAnswersRecieved] = useState(0);
  const totalPlayers = useAppSelector((state) => state.game.players.length);

  useSocketEvent(socket, "answerRecieved", (data: { playerId: string; totalAnswers: number }) => {
    const { totalAnswers } = data;
    setAnswersRecieved(totalAnswers);
  });

  useSocketEvent(socket, "allPlayersAnswered", (randomizedAnswers: Game["latestAnswers"]) => {
    dispatch(setAnswers(randomizedAnswers));
    dispatch(setCurrentStage("Voting"));
  });

  if (!socket) return <div className="text-primary font-bold text-center">Socket is undefined</div>;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="heading-display text-3xl text-gray-800 mb-6" style={{ fontStyle: "italic" }}>Answer Submitted</h1>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 px-5 py-4 w-full max-w-md mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">Prompt</p>
        <p className="text-lg text-gray-800">{prompt}</p>
      </div>

      <div className="text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">Waiting for other players</p>
        <p className="font-mono text-5xl font-bold text-gray-800 anim-count-pulse">
          {answersRecieved} / {totalPlayers}
        </p>

        <div className="mt-8 flex justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 border-t-gray-800 animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default AwaitingResponses;
