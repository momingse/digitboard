"use client";

import { createUsersStore } from "./users-store";
import { createContext, ReactNode, useRef } from "react";

export type UsersStoreApi = ReturnType<typeof createUsersStore>;
export const UsersStoreContext = createContext<UsersStoreApi | undefined>(
  undefined,
);

interface UsersStoreProviderProps {
  children: ReactNode;
}

export const UsersStoreProvider = ({ children }: UsersStoreProviderProps) => {
  const storeRef = useRef<UsersStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createUsersStore();
  }

  return (
    <UsersStoreContext.Provider value={storeRef.current}>
      {children}
    </UsersStoreContext.Provider>
  );
};
