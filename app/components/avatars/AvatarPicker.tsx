"use client";

import React from "react";
import AVATARS, { avatarToDataUri } from "./avatarData";

interface AvatarPickerProps {
  selected: string;
  onSelect: (id: string) => void;
  takenAvatars?: string[];
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ selected, onSelect, takenAvatars = [] }) => {
  return (
    <div>
      <p className="label-caps text-text-muted mb-3">Choose Your Avatar</p>
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {AVATARS.map((avatar) => {
          const taken = takenAvatars.includes(avatar.id);
          const isSelected = selected === avatar.id;

          return (
            <button
              key={avatar.id}
              onClick={() => !taken && onSelect(avatar.id)}
              disabled={taken}
              className={`
                relative rounded-full transition-all cursor-pointer w-16 h-16
                ${isSelected
                  ? "ring-3 ring-blue scale-110"
                  : taken
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:scale-110"
                }
              `}
              title={avatar.label}
            >
              <img
                src={avatarToDataUri(avatar.id)}
                alt={avatar.label}
                className="w-full h-full rounded-full"
              />
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue rounded-full flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarPicker;
