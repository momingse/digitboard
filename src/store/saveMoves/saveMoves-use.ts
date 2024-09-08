import { useContext } from "react";
import { SaveMovesStoreContext } from "./saveMoves-provider";
import { SaveMovesStore } from "./saveMoves-store";
import { useStore } from "zustand";

export const useSaveMovesStore = <T>(
  selector: (store: SaveMovesStore) => T,
) => {
  const store = useContext(SaveMovesStoreContext);
  if (!store) {
    throw new Error(
      "useSaveMovesStore must be used within a SaveMovesStoreProvider",
    );
  }
  return useStore(store, selector);
};
