import { createStore } from "zustand";

export type OptionsState = {
  lineWidth: number;
  lineColor: string;
  shape: keyof typeof Shape;
  mode: CtxMode;
  selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
};

export type OptionsActions = {
  setLineWidth: (lineWidth: number) => void;
  setLineColor: (lineColor: string) => void;
  setShape: (shape: keyof typeof Shape) => void;
  setMode: (mode: CtxMode) => void;
  setSelection: (selection: OptionsState["selection"]) => void;
};

export type OptionsStore = OptionsState & OptionsActions;

export const defaultInitialOptionsState: OptionsState = {
  lineWidth: 5,
  lineColor: "#000000",
  shape: "line",
  mode: "draw",
  selection: null,
};

export const createOptionsStore = (
  initState: OptionsState = defaultInitialOptionsState,
) => {
  return createStore<OptionsStore>((set) => ({
    ...initState,
    setLineWidth: (lineWidth: number) => set({ lineWidth }),
    setLineColor: (lineColor: string) => set({ lineColor }),
    setShape: (shape: keyof typeof Shape) => set({ shape }),
    setMode: (mode: CtxMode) => set({ mode }),
    setSelection: (selection: OptionsState["selection"]) => set({ selection }),
  }));
};
