"use client";

import React, { createContext, useContext, useState } from "react";

interface PresentationContextType {
  presentationMode: boolean;
  togglePresentationMode: () => void;
}

const PresentationContext = createContext<PresentationContextType>({
  presentationMode: false,
  togglePresentationMode: () => {},
});

export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [presentationMode, setPresentationMode] = useState(false);

  const togglePresentationMode = () => setPresentationMode((prev) => !prev);

  return (
    <PresentationContext.Provider value={{ presentationMode, togglePresentationMode }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentationMode() {
  return useContext(PresentationContext);
}
