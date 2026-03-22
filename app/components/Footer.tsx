"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6">
      <p className="text-[#5B7AB5] text-xs tracking-widest uppercase font-medium text-center">
        Made by{" "}
        <a
          href="https://www.ethanjagoda.me"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Jagoda Labs
        </a>
      </p>
    </footer>
  );
};

export default Footer;
