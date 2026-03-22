import React from "react";

const BauhausBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Large red circle — top right */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,58,58,0.25) 0%, transparent 70%)",
        }}
      />

      {/* Yellow triangle — bottom left */}
      <div
        className="absolute bottom-20 -left-10 anim-float"
        style={{
          width: 0, height: 0,
          borderLeft: "60px solid transparent",
          borderRight: "60px solid transparent",
          borderBottom: "100px solid rgba(255,214,0,0.15)",
          filter: "blur(1px)",
        }}
      />

      {/* Blue square — center left */}
      <div
        className="absolute top-1/2 -left-6 w-24 h-24 anim-slow-spin"
        style={{ backgroundColor: "rgba(58,125,255,0.1)" }}
      />

      {/* Small accent shapes */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-primary opacity-20 anim-pulse-geo" />
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-yellow opacity-15" />
      <div className="absolute top-2/3 left-1/4 w-5 h-5 bg-blue opacity-10 anim-slow-spin" />

      {/* Red horizontal line accent */}
      <div className="absolute top-1/3 left-0 w-32 h-0.5 bg-primary opacity-20" />
    </div>
  );
};

export default BauhausBackground;
