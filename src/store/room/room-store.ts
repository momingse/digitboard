import { getNextColor } from "@/lib/getNextColor";
import { createStore } from "zustand";

export type RoomState = {
  id: string;
  users: Map<string, User>;
  usersMoves: Map<string, Move[]>;
  movesWithoutUser: Move[];
  myMoves: Move[];
};

export type RoomActions = {
  setRoomId: (id: string) => void;
  setRoom: (
    users: Map<string, User>,
    usersMoves: Map<string, Move[]>,
    movesWithoutUser: Move[],
  ) => void;
  addUser: (userId: string, username: string) => void;
  removeUser: (userId: string) => void;
  addMoveToUser: (userId: string, move: Move) => void;
  removeMoveFromUser: (userId: string) => void;
  addMoveToMyMoves: (move: Move) => void;
  removeMoveFromMyMoves: () => Move | undefined;
};

export type RoomStore = RoomState & RoomActions;

const defaultInitState: RoomState = {
  id: "",
  users: new Map(),
  usersMoves: new Map(),
  movesWithoutUser: [],
  myMoves: [],
};

export const createRoomStore = (initState: RoomState = defaultInitState) => {
  return createStore<RoomStore>((set) => ({
    ...initState,
    setRoomId: (id: string) => set({ ...defaultInitState, id }),
    setRoom: (
      users: Map<string, User>,
      usersMoves: Map<string, Move[]>,
      movesWithoutUser: Move[],
    ) =>
      set({
        users,
        usersMoves,
        movesWithoutUser,
      }),
    addUser: (userId: string, username: string) =>
      set((state) => {
        const user = {
          name: username,
          color: getNextColor([...state.users.values()].pop()?.color),
        };
        state.users.set(userId, user);
        state.usersMoves.set(userId, []);
        return { users: state.users, usersMoves: state.usersMoves };
      }),
    removeUser: (userId: string) =>
      set((state) => {
        const removedUserMoves = state.usersMoves.get(userId) ?? [];
        state.usersMoves.delete(userId);
        state.users.delete(userId);
        return {
          users: state.users,
          usersMoves: state.usersMoves,
          movesWithoutUser: [...state.movesWithoutUser, ...removedUserMoves],
        };
      }),
    addMoveToUser: (userId: string, move: Move) =>
      set((state) => {
        const moves = state.usersMoves.get(userId) ?? [];
        moves.push(move);
        state.usersMoves.set(userId, moves);
        return { usersMoves: state.usersMoves };
      }),
    removeMoveFromUser: (userId: string) =>
      set((state) => {
        const moves = state.usersMoves.get(userId) ?? [];
        state.usersMoves.set(userId, moves.slice(0, moves.length - 1));
        return { usersMoves: state.usersMoves };
      }),
    addMoveToMyMoves: (move: Move) =>
      set((state) => {
        if (
          state.myMoves[state.myMoves.length - 1]?.options.mode === "select"
        ) {
          return {
            myMoves: [
              ...state.myMoves.slice(0, state.myMoves.length - 1),
              move,
            ],
          };
        }
        return { myMoves: [...state.myMoves, move] };
      }),
    removeMoveFromMyMoves: () => {
      let move: Move | undefined;
      set((state) => {
        move = state.myMoves.pop();
        return { myMoves: state.myMoves };
      });
      return move;
    },
  }));
};
