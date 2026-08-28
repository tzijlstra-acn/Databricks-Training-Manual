"use client";

import React, { createContext, useContext, useState } from "react";

export type ViewLevel = 'beginner' | 'standard' | 'pro';

interface BeginnerModeContextType {
  viewLevel: ViewLevel;
  setViewLevel: (level: ViewLevel) => void;
  // Backwards-compatible computed boolean
  beginnerMode: boolean;
  toggleBeginnerMode: () => void;
}

const BeginnerModeContext = createContext<BeginnerModeContextType>({
  viewLevel: 'beginner',
  setViewLevel: () => {},
  beginnerMode: true,
  toggleBeginnerMode: () => {},
});

export function BeginnerModeProvider({ children }: { children: React.ReactNode }) {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('beginner');

  const beginnerMode = viewLevel === 'beginner';
  const toggleBeginnerMode = () =>
    setViewLevel((prev) => (prev === 'beginner' ? 'standard' : 'beginner'));

  return (
    <BeginnerModeContext.Provider value={{ viewLevel, setViewLevel, beginnerMode, toggleBeginnerMode }}>
      {children}
    </BeginnerModeContext.Provider>
  );
}

export function useBeginnerMode() {
  return useContext(BeginnerModeContext);
}
