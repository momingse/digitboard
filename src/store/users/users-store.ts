import { createStore } from "zustand";

export type UsersState = {
  users: Record<string, Move[]>;
};

export type UsersActions = {
  addUser: (userId: string, move?: Move[]) => void;
  removeUser: (userId: string) => void;
  addMove: (userId: string, move: Move) => void;
  undoMove: (userId: string) => void;
};

export type UsersStore = UsersState & UsersActions;

export const createUsersStore = (initState: UsersState = { users: {} }) => {
  return createStore<UsersStore>((set) => ({
    ...initState,

    addUser: (userId: string, move: Move[] = []) => {
      set((state) => ({
        users: { ...state.users, [userId]: move },
      }));
    },

    removeUser: (userId: string) => {
      set((state) => {
        const users = { ...state.users };
        delete users[userId];
        return { users };
      });
    },

    addMove: (userId: string, move: Move) => {
      set((state) => {
        const previousMove = state.users[userId] ?? [];
        const users = {
          ...state.users,
          [userId]: [...previousMove, move],
        };
        return { users };
      });
    },

    undoMove: (userId: string) => {
      set((state) => {
        if (!state.users[userId]) return { user: state.users };
        return {
          users: {
            ...state.users,
            [userId]: state.users[userId].slice(0, -1),
          },
        };
      });
    },
  }));
};
