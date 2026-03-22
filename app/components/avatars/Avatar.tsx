"use client";

import React from "react";
import { getAvatarById, avatarToDataUri } from "./avatarData";

interface AvatarProps {
  avatarId: string;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatarId, size = 40, className = "" }) => {
  const avatar = getAvatarById(avatarId);
  if (!avatar) return null;

  return (
    <img
      src={avatarToDataUri(avatarId)}
      alt={avatar.label}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
