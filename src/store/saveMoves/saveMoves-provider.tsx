import { createContext, ReactNode, useRef } from "react";
import { createSaveMovesStore } from "./saveMoves-store";

export type SaveMovesStoreApi = ReturnType<typeof createSaveMovesStore>;
export const SaveMovesStoreContext = createContext<
  SaveMovesStoreApi | undefined
>(undefined);

interface SaveMovesStoreProviderProps {
  children: ReactNode;
}

export const SaveMovesStoreProvider = ({
  children,
}: SaveMovesStoreProviderProps) => {
  const storeRef = useRef<SaveMovesStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createSaveMovesStore();
  }

  return (
    <SaveMovesStoreContext.Provider value={storeRef.current}>
      {children}
    </SaveMovesStoreContext.Provider>
  );
};
