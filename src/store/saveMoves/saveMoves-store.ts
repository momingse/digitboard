import { createStore } from "zustand";

export type SaveMovesState = {
  moves: Move[];
};

export type SaveMovesActions = {
  addMove: (move: Move) => void;
  popMove: () => Move | undefined;
  clearMoves: () => void;
};

export type SaveMovesStore = SaveMovesState & SaveMovesActions;

const defaultInitState: SaveMovesState = {
  moves: [],
};

export const createSaveMovesStore = (
  initState: SaveMovesState = defaultInitState,
) => {
  return createStore<SaveMovesStore>((set) => ({
    ...initState,

    addMove: (move: Move) => {
      set((state) => ({
        moves: [...state.moves, move],
      }));
    },

    popMove: () => {
      let move: Move | undefined;
      set((state) => {
        move = state.moves.pop();
        return { moves: state.moves };
      });
      return move;
    },

    clearMoves: () => set(() => ({ moves: [] })),
  }));
};
