import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { useSocketEvent } from "@/app/functions/useSocketEvent";
import { setAnswers, setCurrentStage } from "@/app/store/slices/gameSlice";

const AwaitingResponses: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const [answersRecieved, setAnswersRecieved] = useState(0);
  const totalPlayers = useAppSelector((state) => state.game.players.length);

  useSocketEvent(socket, "answerRecieved", (data: { playerId: string; totalAnswers: number }) => {
    const { playerId, totalAnswers } = data;
    console.log("totalAnswers: ", totalAnswers);
    setAnswersRecieved(totalAnswers);
  });

  useSocketEvent(socket, "allPlayersAnswered", (randomizedAnswers: Game["latestAnswers"]) => {
    console.log("randomizedAnswers: ", randomizedAnswers);
    dispatch(setAnswers(randomizedAnswers));
    dispatch(setCurrentStage("Voting"));
  });

  if (!socket) return <div className="text-center text-red-500 font-bold">Socket is undefined</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full font-sans">
      <h1 className="text-4xl font-black mb-8 text-text-primary uppercase tracking-widest text-center">Answer Submitted</h1>
      <div className="bg-accent bauhaus-border p-6 max-w-md w-full mb-8">
        <h2 className="text-2xl font-black mb-4 text-text-primary uppercase border-b-4 border-text-primary pb-2">Question:</h2>
        <p className="text-xl font-bold text-text-primary">{question}</p>
      </div>
      <div className="mt-8 text-center bg-background-light bauhaus-border p-6 w-full max-w-md">
        <p className="text-xl font-bold text-text-primary uppercase mb-4">Waiting for other players...</p>
        <h2 className="text-5xl font-black text-primary tracking-widest mb-6">
          {answersRecieved} / {totalPlayers}
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin h-16 w-16 border-8 border-text-primary border-t-primary rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AwaitingResponses;
