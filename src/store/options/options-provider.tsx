"use client";

import { createContext, ReactNode, useRef } from "react";
import { createOptionsStore } from "./options-store";

export type OptionsStoreApi = ReturnType<typeof createOptionsStore>;
export const OptionsStoreContext = createContext<OptionsStoreApi | undefined>(
  undefined,
);

interface OptionsStoreProviderProps {
  children: ReactNode;
}

export const OptionsStoreProvider = ({
  children,
}: OptionsStoreProviderProps) => {
  const storeRef = useRef<OptionsStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createOptionsStore();
  }

  return (
    <OptionsStoreContext.Provider value={storeRef.current}>
      {children}
    </OptionsStoreContext.Provider>
  );
};
