"use client";

import { createContext, ReactNode, useRef } from "react";
import { createRoomStore } from "./room-store";

export type RoomStoreApi = ReturnType<typeof createRoomStore>;
export const RoomStoreContext = createContext<RoomStoreApi | undefined>(
  undefined,
);

interface RoomStoreProviderProps {
  children: ReactNode;
}

export const RoomStoreProvider = ({ children }: RoomStoreProviderProps) => {
  const storeRef = useRef<RoomStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createRoomStore();
  }

  return (
    <RoomStoreContext.Provider value={storeRef.current}>
      {children}
    </RoomStoreContext.Provider>
  );
};
