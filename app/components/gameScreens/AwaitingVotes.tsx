import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { useSocketEvent } from "@/app/functions/useSocketEvent";
import { setAnswers, setCurrentStage, setPlayers } from "@/app/store/slices/gameSlice";

const AwaitingVotes: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
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

  if (!socket) return <div className="text-center text-red-500 font-bold">Socket is undefined</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full font-sans">
      <h1 className="text-4xl font-black mb-8 text-text-primary uppercase tracking-widest text-center">Waiting for Votes</h1>
      <div className="bg-accent bauhaus-border p-6 max-w-md w-full mb-8">
        <h2 className="text-2xl font-black mb-4 text-text-primary uppercase border-b-4 border-text-primary pb-2">Question:</h2>
        <p className="text-xl font-bold text-text-primary">{question}</p>
      </div>
      <div className="text-center bg-background-light bauhaus-border p-8 w-full max-w-md">
        <p className="text-2xl font-bold mb-6 text-text-primary uppercase">
          Votes received: <span className="font-black text-primary">{votesReceived}</span> / {totalPlayers}
        </p>
        <div className="relative pt-1 mb-8">
          <div className="overflow-hidden h-6 text-xs flex bg-background-light bauhaus-border">
            <div
              style={{ width: `${(votesReceived / totalPlayers) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500 ease-in-out"
            ></div>
          </div>
        </div>
        <div className="flex flex-col items-center text-text-primary font-bold uppercase text-lg">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-8 border-text-primary border-t-primary mb-4"></div>
          Waiting for all votes...
        </div>
      </div>
    </div>
  );
};

export default AwaitingVotes;
