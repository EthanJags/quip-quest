"use client";

import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector, useAppDispatch } from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";
import { Avatar } from "@/app/components/avatars";

const Results: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const prompt = useAppSelector((state) => state.game.currentPrompt);
  const latestAnswers = useAppSelector((state) => state.game.latestAnswers);
  const players = useAppSelector((state) => state.game.players);
  const [timeLeft, setTimeLeft] = useState(30);
  const maxRounds = useAppSelector((state) => state.game.gameSettings.rounds);
  const currentRound = useAppSelector((state) => state.game.currentRound);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleMoveToScores();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const getPlayer = (playerId: string) => {
    return players.find((p) => p.id === playerId);
  };

  const getPlayerName = (playerId: string) => {
    const player = getPlayer(playerId);
    return player ? player.name : "Unknown Player";
  };

  const handleMoveToScores = () => {
    if (currentRound < maxRounds) {
      dispatch(setCurrentStage("Score"));
    } else {
      dispatch(setCurrentStage("End"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="heading-display text-3xl text-gray-800 mb-6 text-center" style={{ fontStyle: "italic" }}>Results</h1>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 px-5 py-4 mb-6">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">Prompt</p>
        <p className="text-lg text-gray-800">{prompt}</p>
      </div>

      <div className="space-y-3">
        {Object.entries(latestAnswers).map(([playerId, answer]) => (
          <div key={playerId} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 px-5 py-4">
            <img src={answer.drawing} alt="Drawing" className="w-full max-w-sm rounded-lg border border-gray-200/60 mb-4" />

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {getPlayer(answer.submittedBy)?.avatar && (
                  <Avatar avatarId={getPlayer(answer.submittedBy)!.avatar} size={24} />
                )}
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400">
                  {getPlayerName(answer.submittedBy)}
                </p>
              </div>
              <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                {answer.votes.length} {answer.votes.length === 1 ? "vote" : "votes"}
              </span>
            </div>

            {answer.votes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200/60">
                <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">Voted by</p>
                <div className="flex flex-wrap gap-1.5">
                  {answer.votes.map((voterId) => (
                    <span key={voterId} className="bg-white/70 text-gray-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                      {getPlayer(voterId)?.avatar && (
                        <Avatar avatarId={getPlayer(voterId)!.avatar} size={18} />
                      )}
                      {getPlayerName(voterId)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleMoveToScores}
          className="mt-6 py-3 px-8 rounded-full bg-white text-gray-900 border border-gray-200 text-sm font-medium tracking-wide shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer"
        >
          move to scores
        </button>
      </div>
    </div>
  );
};

export default Results;
