"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <nav className="bg-background-light py-4 border-b-4 border-text-primary font-sans relative z-50">
      <div className="flex justify-between items-center px-6">
        <button
          onClick={handleHomeClick}
          className="text-text-primary hover:text-primary transition duration-300 ease-in-out border-4 border-text-primary p-2 bg-accent bauhaus-shadow"
          aria-label="Go to home page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeWidth={3}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10h3m10-11l2 2m-2-2v10h-3m-6 0v-4h2v4h6"
            />
          </svg>
        </button>
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
