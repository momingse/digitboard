import { useContext, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { BackgroundStore } from "./background-store";
import { BackgorundStoreContext } from "./background-provider";

export const useBackgroundStore = <T>(
  selector: (store: BackgroundStore) => T,
) => {
  const store = useContext(BackgorundStoreContext);

  if (!store) {
    throw new Error(
      "useBackgroundStore must be used within a BackgroundProvider",
    );
  }

  return useStore(store, selector);
};
