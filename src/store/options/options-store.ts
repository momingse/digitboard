import { RgbaColor } from "react-colorful";
import { createStore } from "zustand";

export type OptionsState = {
  lineWidth: number;
  lineColor: RgbaColor;
  fillColor: RgbaColor;
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
  setLineColor: (lineColor: RgbaColor) => void;
  setFillColor: (fillColor: RgbaColor) => void;
  setShape: (shape: keyof typeof Shape) => void;
  setMode: (mode: CtxMode) => void;
  setSelection: (selection: OptionsState["selection"]) => void;
};

export type OptionsStore = OptionsState & OptionsActions;

export const defaultInitialOptionsState: OptionsState = {
  lineWidth: 5,
  lineColor: { r: 0, g: 0, b: 0, a: 1 },
  fillColor: { r: 0, g: 0, b: 0, a: 0 },
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
    setLineColor: (lineColor: RgbaColor) => set({ lineColor }),
    setFillColor: (fillColor: RgbaColor) => set({ fillColor }),
    setShape: (shape: keyof typeof Shape) => set({ shape }),
    setMode: (mode: CtxMode) => set({ mode }),
    setSelection: (selection: OptionsState["selection"]) => set({ selection }),
  }));
};
