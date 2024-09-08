import { createStore } from "zustand";

export type SaveMovesState = {
  savedMoves: Move[];
};

export type SaveMovesActions = {
  addMove: (move: Move) => void;
  popMove: () => Move | undefined;
  clearMoves: () => void;
};

export type SaveMovesStore = SaveMovesState & SaveMovesActions;

const defaultInitState: SaveMovesState = {
  savedMoves: [],
};

export const createSaveMovesStore = (
  initState: SaveMovesState = defaultInitState,
) => {
  return createStore<SaveMovesStore>((set) => ({
    ...initState,

    addMove: (move: Move) => {
      set((state) => ({
        savedMoves: [...state.savedMoves, move],
      }));
    },

    popMove: () => {
      let move: Move | undefined;
      set((state) => {
        move = state.savedMoves.pop();
        return { savedMoves: state.savedMoves };
      });
      return move;
    },

    clearMoves: () => set({ savedMoves: [] }),
  }));
};
