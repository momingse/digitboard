import { createContext, ReactNode, useRef } from "react";
import { createModalStore } from "./modal-store";

export type ModalStoreApi = ReturnType<typeof createModalStore>;
export const ModalStoreContext = createContext<ModalStoreApi | undefined>(
  undefined,
);

interface ModalStoreProviderProps {
  children: ReactNode;
}

export const ModalStoreProvider = ({ children }: ModalStoreProviderProps) => {
  const storeRef = useRef<ModalStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createModalStore();
  }

  return (
    <ModalStoreContext.Provider value={storeRef.current}>
      {children}
    </ModalStoreContext.Provider>
  );
};
