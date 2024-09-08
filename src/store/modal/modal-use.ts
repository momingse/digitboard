import { useContext } from "react";
import { useStore } from "zustand";
import { ModalStoreContext } from "./modal-provider";
import { ModalStore } from "./modal-store";

export const useModalStore = <T>(selector: (store: ModalStore) => T) => {
  const store = useContext(ModalStoreContext);
  if (!store) {
    throw new Error("useModalStore must be used within a StoreProvider");
  }

  return useStore(store, selector);
};
