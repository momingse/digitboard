import { createStore } from "zustand";

export type OptionsState = {
  lineWidth: number;
  lineColor: string;
  erase: boolean;
  shape: keyof typeof Shape;
};

export type OptionsActions = {
  setLineWidth: (lineWidth: number) => void;
  setLineColor: (lineColor: string) => void;
  setErase: (erase: boolean) => void;
  setShape: (shape: keyof typeof Shape) => void;
};

export type OptionsStore = OptionsState & OptionsActions;

export const defaultInitialOptionsState: OptionsState = {
  lineWidth: 5,
  lineColor: "#000000",
  erase: false,
  shape: "line",
};

export const createOptionsStore = (
  initState: OptionsState = defaultInitialOptionsState,
) => {
  return createStore<OptionsStore>((set) => ({
    ...initState,
    setLineWidth: (lineWidth: number) => set({ lineWidth }),
    setLineColor: (lineColor: string) => set({ lineColor }),
    setErase: (erase: boolean) => set({ erase }),
    setShape: (shape: keyof typeof Shape) => set({ shape }),
  }));
};
