"use client";

import { createContext, useEffect, useRef } from "react";
import { createBackgroundStore } from "./background-store";

export type BackgroundApi = ReturnType<typeof createBackgroundStore>;
export const BackgorundStoreContext = createContext<BackgroundApi | undefined>(
  undefined,
);

interface BackgroundStoreProviderProps {
  children: React.ReactNode;
}

export function BackgroundStoreProvider({
  children,
}: BackgroundStoreProviderProps) {
  const storeRef = useRef<BackgroundApi>();

  useEffect(() => {
    storeRef.current = createBackgroundStore();

    const unsubscribe = storeRef.current.subscribe((state, prevState) => {
      if (state.mode === prevState.mode) return;

      const root = window.document.documentElement;
      root.classList.remove(prevState.mode);
      root.classList.add(state.mode);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <BackgorundStoreContext.Provider value={storeRef.current}>
      {children}
    </BackgorundStoreContext.Provider>
  );
}
