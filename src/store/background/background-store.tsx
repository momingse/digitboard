import { createStore } from "zustand";

export type BackgroundState = {
  mode: "dark" | "light";
  lines: boolean;
};

export type BackgroundActions = {
  setMode: (mode: "dark" | "light") => void;
  setLines: (lines: boolean) => void;
};

export type BackgroundStore = BackgroundState & BackgroundActions;

export const defaultBackgroundState: BackgroundState = {
  mode: "light",
  lines: true,
};

export const createBackgroundStore = (
  initState: BackgroundState = defaultBackgroundState,
) => {
  return createStore<BackgroundStore>((set) => ({
    ...defaultBackgroundState,
    setMode: (mode) => set({ mode }),
    setLines: (lines) => set({ lines }),
  }));
};
