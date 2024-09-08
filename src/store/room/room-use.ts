import { useContext } from "react";
import { useStore } from "zustand";
import { RoomStoreContext } from "./room-provider";
import { RoomState, RoomStore } from "./room-store";

export const useRoomStore = <T>(selector: (store: RoomStore) => T) => {
  const store = useContext(RoomStoreContext);
  if (!store) {
    throw new Error("useRoomStore must be used within a StoreProvider");
  }

  return useStore(store, selector);
};
