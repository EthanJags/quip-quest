import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector, useAppDispatch } from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";

const Results: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
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

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
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
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-5xl font-black text-text-primary mb-8 text-center uppercase tracking-widest">Results</h1>
      <div className="bg-accent bauhaus-border p-6 mb-8">
        <h2 className="text-2xl font-black text-text-primary mb-2 uppercase border-b-4 border-text-primary pb-2">Question:</h2>
        <p className="text-3xl font-bold text-text-primary mt-4">{question}</p>
      </div>

      <div className="space-y-8">
        {Object.entries(latestAnswers).map(([playerId, answer]) => (
          <div key={`${playerId}`} className="bg-background-light bauhaus-border p-6 flex flex-col items-center">
            <img src={answer.drawing} alt="Drawing" className="w-full max-w-md bauhaus-border mb-6" />
            <div className="w-full border-t-4 border-text-primary pt-4">
              <p className="text-xl font-bold text-text-primary uppercase mb-2">Submitted by: <span className="font-black">{getPlayerName(answer.submittedBy)}</span></p>
              <p className="text-xl font-bold text-text-primary uppercase mb-4">Votes: <span className="font-black text-primary">{answer.votes.length}</span></p>
              {answer.votes.length > 0 && (
                <div className="mt-4 bg-gray-200 p-4 bauhaus-border">
                  <h4 className="font-black text-text-primary mb-2 uppercase">Voted by:</h4>
                  <ul className="list-square list-inside text-text-primary font-bold uppercase">
                    {answer.votes.map((voterId) => (
                      <li key={voterId}>{getPlayerName(voterId)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-2xl font-bold text-text-primary uppercase">
          Moving to scores in <span className="font-black text-primary">{timeLeft}</span> seconds
        </p>
        <div className="mt-6 w-full bg-background-light bauhaus-border h-8 relative">
          <div
            className="bg-primary h-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          ></div>
        </div>
      </div>
      <button
        onClick={handleMoveToScores}
        className="mt-8 w-full py-4 px-6 bg-secondary text-background-light bauhaus-button text-xl hover:bg-secondary-dark uppercase"
      >
        MOVE TO SCORES
      </button>
    </div>
  );
};

export default Results;
