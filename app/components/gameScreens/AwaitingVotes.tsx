"use client";

import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { useSocketEvent } from "@/app/functions/useSocketEvent";
import { setAnswers, setCurrentStage, setPlayers } from "@/app/store/slices/gameSlice";

const AwaitingVotes: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const prompt = useAppSelector((state) => state.game.currentPrompt);
  const [votesReceived, setVotesReceived] = useState(0);
  const totalPlayers = useAppSelector((state) => state.game.players.length);

  useSocketEvent(socket, "voteReceived", (data: { voterId: string; totalVotes: number }) => {
    const { totalVotes } = data;
    setVotesReceived(totalVotes);
  });

  useSocketEvent(
    socket,
    "allPlayersVoted",
    (results: { players: Game["players"]; latestAnswers: Game["latestAnswers"] }) => {
      dispatch(setAnswers(results.latestAnswers));
      dispatch(setPlayers(results.players));
      dispatch(setCurrentStage("Results"));
    },
  );

  if (!socket) return <div className="text-primary font-bold text-center">Socket is undefined</div>;

  const progress = totalPlayers > 0 ? (votesReceived / totalPlayers) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="heading-display text-3xl text-gray-800 mb-6" style={{ fontStyle: "italic" }}>Waiting for Votes</h1>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 px-5 py-4 w-full max-w-md mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">Prompt</p>
        <p className="text-lg text-gray-800">{prompt}</p>
      </div>

      <div className="text-center w-full max-w-md">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">Votes received</p>
        <p className="font-mono text-5xl font-bold text-gray-800 mb-6 anim-count-pulse">
          {votesReceived} / {totalPlayers}
        </p>

        <div className="h-2 bg-white/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-800 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 border-t-gray-800 animate-spin" />
        </div>
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mt-4">Waiting for all votes</p>
      </div>
    </div>
  );
};

export default AwaitingVotes;
