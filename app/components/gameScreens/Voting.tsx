"use client";

import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";

const Voting: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const prompt = useAppSelector((state) => state.game.currentPrompt);
  const latestAnswers = useAppSelector((state) => state.game.latestAnswers);
  const currentPlayerId = useAppSelector((state) => state.player.id);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  if (!socket) return <div className="text-primary font-bold text-center">Socket is undefined</div>;

  const handleSubmit = () => {
    if (selectedAnswerId && socket) {
      socket.emit("submitVote", { currentPlayerId: currentPlayerId, answerAuthor: selectedAnswerId });
      dispatch(setCurrentStage("AwaitingVotes"));
    }
  };

  const filteredAnswers = Object.entries(latestAnswers).filter(([_, answer]) => answer.submittedBy !== currentPlayerId);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="heading-display text-3xl text-gray-800 mb-3" style={{ fontStyle: "italic" }}>Vote</h1>
      <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-6">Prompt: {prompt}</p>

      <div className="w-full max-w-2xl space-y-3 mb-6">
        {filteredAnswers.length > 0 ? (
          filteredAnswers.map(([playerId, answer]) => (
            <button
              key={playerId}
              onClick={() => setSelectedAnswerId(answer.submittedBy)}
              className={`w-full p-3 rounded-2xl border-2 transition-all duration-150 text-left cursor-pointer ${
                selectedAnswerId === answer.submittedBy
                  ? "border-gray-900 bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                  : "border-white/50 bg-white/40 hover:border-gray-300 hover:bg-white/60"
              }`}
            >
              {selectedAnswerId === answer.submittedBy && (
                <div className="w-3 h-3 rounded-full bg-gray-900 mb-2" />
              )}
              <img src={answer.drawing} alt="Drawing" className="w-full rounded-lg" />
            </button>
          ))
        ) : (
          <p className="text-center text-gray-400 font-medium">No answers to vote on</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedAnswerId}
        className={`w-full max-w-md py-3.5 rounded-full text-sm font-medium tracking-wide transition-all active:scale-[0.98] ${
          selectedAnswerId
            ? "bg-gray-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 hover:-translate-y-0.5 cursor-pointer"
            : "bg-white/40 text-gray-400 cursor-not-allowed"
        }`}
      >
        submit vote
      </button>
    </div>
  );
};

export default Voting;
