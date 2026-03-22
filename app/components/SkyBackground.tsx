"use client";

import React from "react";

interface SkyBackgroundProps {
  clearTop?: number;
  clearBottom?: number;
  masked?: boolean;
}

const SkyBackground: React.FC<SkyBackgroundProps> = ({ clearTop = 35, clearBottom = 55, masked = false }) => {
  const fadeStart = Math.max(0, clearTop - 8);
  const fadeEnd = Math.min(100, clearBottom + 8);

  const mask = `linear-gradient(to bottom, black ${fadeStart}%, transparent ${clearTop}%, transparent ${clearBottom}%, black ${fadeEnd}%)`;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Sky photo backdrop */}
      <img
        src="/sky.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Cloud layers — optionally masked to clear a band */}
      <div
        className="absolute inset-0"
        style={masked ? {
          maskImage: mask,
          WebkitMaskImage: mask,
        } : undefined}
      >

      {/* Left cloud drifting right */}
      <div className="absolute top-[8%] animate-cloud-right" style={{ animationDuration: "80s" }}>
        <img
          src="/clouds/left cloud.png"
          alt=""
          className="w-[320px] md:w-[450px] opacity-85 mix-blend-screen"
        />
      </div>

      {/* Right cloud drifting left */}
      <div className="absolute top-[22%] right-0 animate-cloud-left" style={{ animationDuration: "95s" }}>
        <img
          src="/clouds/right cloud.png"
          alt=""
          className="w-[280px] md:w-[400px] opacity-80 mix-blend-screen"
        />
      </div>

      {/* Left cloud copy — lower, slower, fainter */}
      <div className="absolute top-[50%] animate-cloud-right" style={{ animationDuration: "110s", animationDelay: "-40s" }}>
        <img
          src="/clouds/left cloud.png"
          alt=""
          className="w-[250px] md:w-[380px] opacity-50 mix-blend-screen"
        />
      </div>

      {/* Right cloud copy — higher, different timing */}
      <div className="absolute top-[35%] right-0 animate-cloud-left" style={{ animationDuration: "85s", animationDelay: "-25s" }}>
        <img
          src="/clouds/right cloud.png"
          alt=""
          className="w-[220px] md:w-[340px] opacity-60 mix-blend-screen"
        />
      </div>

      {/* Long header cloud drifting right near top */}
      <div className="absolute top-[2%] animate-cloud-right" style={{ animationDuration: "120s", animationDelay: "-60s" }}>
        <img
          src="/clouds/cloud-long-header.png"
          alt=""
          className="w-[400px] md:w-[600px] opacity-40 mix-blend-screen"
        />
      </div>

      {/* Extra left cloud — bottom area */}
      <div className="absolute top-[65%] right-0 animate-cloud-left" style={{ animationDuration: "100s", animationDelay: "-15s" }}>
        <img
          src="/clouds/left cloud.png"
          alt=""
          className="w-[200px] md:w-[300px] opacity-35 mix-blend-screen"
        />
      </div>
      </div>
    </div>
  );
};

export default SkyBackground;
