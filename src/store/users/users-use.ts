import { useContext } from "react";
import { useStore } from "zustand";
import { UsersStore } from "./users-store";
import { UsersStoreContext } from "./users-provider";

export const useUsersStore = <T>(selector: (store: UsersStore) => T) => {
  const store = useContext(UsersStoreContext);
  if (!store) {
    throw new Error("");
  }

  return useStore(store, selector);
};

export const useUsersStoreUserIdsSelector = () => {
  return useUsersStore((store) => Object.keys(store.users));
};
