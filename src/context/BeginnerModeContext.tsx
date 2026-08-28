"use client";

import React, { createContext, useContext, useState } from "react";

interface BeginnerModeContextType {
  beginnerMode: boolean;
  toggleBeginnerMode: () => void;
}

const BeginnerModeContext = createContext<BeginnerModeContextType>({
  beginnerMode: true,
  toggleBeginnerMode: () => {},
});

export function BeginnerModeProvider({ children }: { children: React.ReactNode }) {
  const [beginnerMode, setBeginnerMode] = useState(true);

  const toggleBeginnerMode = () => setBeginnerMode((prev) => !prev);

  return (
    <BeginnerModeContext.Provider value={{ beginnerMode, toggleBeginnerMode }}>
      {children}
    </BeginnerModeContext.Provider>
  );
}

export function useBeginnerMode() {
  return useContext(BeginnerModeContext);
}
