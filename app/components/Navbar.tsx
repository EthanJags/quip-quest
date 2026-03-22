"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 px-4">
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl px-6 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] max-w-md w-full">
        <div className="flex justify-center items-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 group"
            aria-label="Go to home page"
          >
            <span className="text-2xl">🎨</span>
            <span className="font-display text-sm font-bold uppercase tracking-[0.15em] text-text">
              Sketchy Business
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
