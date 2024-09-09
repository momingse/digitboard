import { useContext } from "react";
import { useStore } from "zustand";
import { OptionsStoreContext } from "./options-provider";
import { OptionsState, OptionsStore } from "./options-store";

export const useOptionsStore = <T>(selector: (store: OptionsStore) => T) => {
  const store = useContext(OptionsStoreContext);
  if (!store) {
    throw new Error("useOptionsStore must be used within a StoreProvider");
  }

  return useStore(store, selector);
};

export const useOptionsStoreOptionsSelector  = (): OptionsState => {
  return useOptionsStore((store) => ({
    lineWidth: store.lineWidth,
    lineColor: store.lineColor,
    fillColor: store.fillColor,
    mode: store.mode,
    shape: store.shape,
    selection: store.selection,
  }));
};
