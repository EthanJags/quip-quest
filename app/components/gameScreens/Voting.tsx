import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";

const Voting: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const latestAnswers = useAppSelector((state) => state.game.latestAnswers);
  const currentPlayerId = useAppSelector((state) => state.player.id);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  if (!socket) return <div className="text-center text-red-500 font-bold">Socket is undefined</div>;

  const handleSubmit = () => {
    if (selectedAnswerId && socket) {
      socket.emit("submitVote", { currentPlayerId: currentPlayerId, answerAuthor: selectedAnswerId });
      dispatch(setCurrentStage("AwaitingVotes"));
    }
  };

  // Filter out the current player's answer
  const filteredAnswers = Object.entries(latestAnswers).filter(([_, answer]) => answer.submittedBy !== currentPlayerId);

  const answerOptions = filteredAnswers.map(([playerId, answer]) => (
    <button
      key={`${playerId}`}
      onClick={() => setSelectedAnswerId(answer.submittedBy)}
      className={`w-full p-4 mb-4 text-left bauhaus-border transition-colors duration-200 ${
        selectedAnswerId === answer.submittedBy
          ? "bg-primary border-text-primary scale-[1.02]"
          : "bg-background-light hover:bg-gray-200"
      }`}
    >
      <img src={answer.drawing} alt="Drawing" className="w-full bauhaus-border" />
    </button>
  ));

  return (
    <div className="flex flex-col items-center justify-center h-full font-sans">
      <h1 className="text-4xl font-black mb-8 text-text-primary uppercase tracking-widest text-center">Vote for a Drawing</h1>
      <div className="bg-accent bauhaus-border p-6 max-w-2xl w-full mb-8">
        <p className="text-2xl font-bold text-text-primary mb-6 uppercase text-center border-b-4 border-text-primary pb-4">Prompt: {question}</p>
        <div className="space-y-4">
          {answerOptions.length > 0 ? (
            answerOptions
          ) : (
            <p className="text-center text-text-primary font-bold uppercase">No answers to vote on</p>
          )}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selectedAnswerId}
        className={`w-full max-w-md py-4 px-6 bauhaus-button text-xl uppercase ${
          selectedAnswerId ? "bg-secondary text-background-light hover:bg-secondary-dark" : "bg-gray-400 text-text-primary cursor-not-allowed"
        }`}
      >
        SUBMIT VOTE
      </button>
    </div>
  );
};

export default Voting;
