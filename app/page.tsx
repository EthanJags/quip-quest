"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./store/constants/reduxTypes";
import { getSocket, initSocket } from "./functions/socketManager";
import { setPlayerIsHost, setPlayerName } from "./store/slices/playerSlice";
import { setGame } from "./store/slices/gameSlice";
import { useSocketEvent } from "./functions/useSocketEvent";

// Icons placed in-between — not on the edges, not overlapping center content
// sm: 6 icons
const smIcons = [
  { src: "/icons/palette.png", top: "8%", left: "12%", size: 100, delay: "0s", duration: "7s", rotate: -15 },
  { src: "/icons/dice.png", top: "10%", right: "14%", size: 90, delay: "0.8s", duration: "9.5s", rotate: 30 },
  { src: "/icons/lightbulb.png", top: "42%", left: "8%", size: 70, delay: "3s", duration: "8.5s", rotate: -20 },
  { src: "/icons/trophy.png", top: "40%", right: "8%", size: 80, delay: "2s", duration: "8s", rotate: -8 },
  { src: "/icons/pencil.png", top: "72%", left: "10%", size: 80, delay: "3.5s", duration: "8s", rotate: -35 },
  { src: "/icons/rubber-duck.png", top: "74%", right: "12%", size: 80, delay: "1.5s", duration: "7.5s", rotate: 18 },
];
// md: all 12 icons
const mdIcons = [
  { src: "/icons/palette.png", top: "6%", left: "10%", size: 120, delay: "0s", duration: "7s", rotate: -15 },
  { src: "/icons/eraser.png", top: "5%", left: "32%", size: 65, delay: "2s", duration: "6.5s", rotate: -12 },
  { src: "/icons/dice.png", top: "8%", right: "12%", size: 100, delay: "0.8s", duration: "9.5s", rotate: 30 },
  { src: "/icons/pencil.png", top: "6%", right: "30%", size: 80, delay: "3.5s", duration: "8s", rotate: -35 },
  { src: "/icons/lightbulb.png", top: "30%", left: "8%", size: 75, delay: "3s", duration: "8.5s", rotate: -20 },
  { src: "/icons/lollipop.png", top: "28%", right: "10%", size: 70, delay: "2.5s", duration: "7s", rotate: 10 },
  { src: "/icons/trophy.png", top: "50%", left: "10%", size: 80, delay: "2s", duration: "8s", rotate: -8 },
  { src: "/icons/colored-pencils.png", top: "48%", right: "8%", size: 85, delay: "0.5s", duration: "10s", rotate: 15 },
  { src: "/icons/scissors.png", top: "64%", right: "10%", size: 85, delay: "1.2s", duration: "11s", rotate: -25 },
  { src: "/icons/disco-ball.png", top: "80%", left: "15%", size: 90, delay: "1s", duration: "9s", rotate: 12 },
  { src: "/icons/magnifying-glass.png", top: "78%", left: "42%", size: 80, delay: "0.3s", duration: "9s", rotate: 15 },
  { src: "/icons/rubber-duck.png", top: "76%", right: "14%", size: 85, delay: "1.5s", duration: "7.5s", rotate: 18 },
];

export default function Home() {
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const socketID = useAppSelector((state) => state.socket.id);
  const player = useAppSelector((state) => state.player);
  const [showRules, setShowRules] = useState<boolean>(false);
  const socket = socketID ? getSocket() : null;
  const toggleRules = () => setShowRules(!showRules);

  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) setCode(codeFromUrl);
  }, [searchParams]);

  useEffect(() => {
    if (!socket) setError("Failed to connect to server. Please try again later.");
    else setError("");
  }, [socket, socketID]);

  const handleValidCode = useCallback(
    (game: Game) => {
      setIsSubmitting(false);
      dispatch(setGame(game));
      router.push(`/waitingRoom?code=${game.code}`);
    },
    [dispatch, router],
  );
  const handleInvalidCode = useCallback(() => {
    setIsSubmitting(false);
    setError("Invalid code. Please try again.");
    setCode("");
  }, []);
  const handleNameTaken = useCallback(() => {
    setIsSubmitting(false);
    setError("This name is already taken. Please choose a different name.");
  }, []);

  useSocketEvent(socket, "validCode", handleValidCode);
  useSocketEvent(socket, "invalidCode", handleInvalidCode);
  useSocketEvent(socket, "nameTaken", handleNameTaken);

  function createPlayer({ isHost }: { isHost: boolean }) {
    dispatch(setPlayerName(name));
    dispatch(setPlayerIsHost(isHost));
  }

  const handleHostClick = () => {
    if (!name) { setError("Please enter a name"); return; }
    createPlayer({ isHost: true });
    router.push("/hostSettings");
  };

  const handleJoinClick = () => {
    if (!name) { setError("Please enter a name"); return; }
    if (!code) { setError("Please enter a game code"); return; }
    setError("");
    setIsSubmitting(true);
    createPlayer({ isHost: false });
    socket?.emit("joinGame", { code, player: { ...player, name, isHost: false } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Floating icons — sm: 6 icons, md: 12 icons, each with own positions */}
      {smIcons.map((item, i) => (
        <div
          key={`sm-${i}`}
          className="absolute anim-float pointer-events-none select-none z-1 hidden sm:block md:hidden"
          style={{
            top: item.top, left: item.left, right: item.right,
            animationDelay: item.delay, animationDuration: item.duration,
            transform: `rotate(${item.rotate}deg)`,
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))",
          }}
          aria-hidden="true"
        >
          <img src={item.src} alt="" width={item.size} height={item.size} style={{ objectFit: "contain" }} draggable={false} />
        </div>
      ))}
      {mdIcons.map((item, i) => (
        <div
          key={`md-${i}`}
          className="absolute anim-float pointer-events-none select-none z-1 hidden md:block"
          style={{
            top: item.top, left: item.left, right: item.right,
            animationDelay: item.delay, animationDuration: item.duration,
            transform: `rotate(${item.rotate}deg)`,
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))",
          }}
          aria-hidden="true"
        >
          <img src={item.src} alt="" width={item.size} height={item.size} style={{ objectFit: "contain" }} draggable={false} />
        </div>
      ))}

      {/* Hero title */}
      <div className="relative z-10 text-center mb-8 anim-fade-up">
        <h1 className="heading-display text-7xl md:text-9xl text-gray-900" style={{ fontStyle: "italic" }}>
          Sketchy Business
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-gray-900 font-medium tracking-wide">
          where bad art wins big
        </p>
      </div>

      {/* Form — no card, floats on sky */}
      <div className="w-full max-w-sm relative z-10 anim-fade-up delay-200 mt-6 space-y-3">
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="your name"
          className="w-full px-6 py-4 bg-pink rounded-full text-sm font-bold text-gray-900 uppercase tracking-widest placeholder:text-gray-900/35 placeholder:font-bold placeholder:uppercase placeholder:tracking-widest border-2 border-dashed border-gray-900 focus:outline-none focus:border-gray-700 transition-all"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="game code"
          className="w-full px-6 py-4 bg-pink rounded-full text-sm font-bold text-gray-900 uppercase tracking-widest placeholder:text-gray-900/35 placeholder:font-bold placeholder:uppercase placeholder:tracking-widest border-2 border-dashed border-gray-900 focus:outline-none focus:border-gray-700 transition-all"
        />

        <div className="flex gap-2.5 pt-1">
          <button
            onClick={handleHostClick}
            className="flex-1 py-3.5 rounded-full bg-gray-900 text-white text-sm font-medium tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer"
          >
            host game
          </button>
          <button
            onClick={handleJoinClick}
            className={`flex-1 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all active:scale-[0.98] ${
              isSubmitting
                ? "bg-white/40 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-900 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 cursor-pointer"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "joining..." : "join game"}
          </button>
        </div>

        <button
          onClick={toggleRules}
          className="w-full py-2 text-gray-900/50 text-xs font-medium tracking-widest uppercase hover:text-gray-900 transition-colors cursor-pointer"
        >
          how to play
        </button>

        {error && (
          <p className="text-red-100 bg-red-500/20 backdrop-blur-sm text-xs font-medium text-center py-2 px-4 rounded-full anim-fade-in">
            {error}
          </p>
        )}
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={toggleRules}>
          <div className="w-full max-w-sm mx-4 bg-white rounded-3xl p-6 relative anim-fade-up shadow-[0_8px_40px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={toggleRules}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-150 cursor-pointer"
              aria-label="Close rules"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <h2 className="heading-display text-3xl text-gray-900 mb-6" style={{ fontStyle: "italic" }}>Rules</h2>
            <ul className="space-y-4">
              {[
                { icon: "/icons/palette.png", text: "Players answer prompts with witty drawings." },
                { icon: "/icons/magnifying-glass.png", text: "Other players vote for their favorite answers." },
                { icon: "/icons/dice.png", text: "Points are awarded based on votes received." },
                { icon: "/icons/trophy.png", text: "The player with the most points wins!" },
              ].map((rule, i) => (
                <li key={i} className="flex gap-4 items-center">
                  <img src={rule.icon} alt="" width={28} height={28} className="shrink-0 object-contain" />
                  <span className="text-gray-900 text-sm leading-relaxed">{rule.text}</span>
                </li>
              ))}
            </ul>
            <button onClick={toggleRules} className="w-full mt-6 py-3.5 rounded-full bg-gray-900 text-white text-sm font-medium tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer">
              got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
