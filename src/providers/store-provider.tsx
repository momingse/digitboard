"use client";

import { ModalStoreProvider } from "@/store/modal/modal-provider";
import { OptionsStoreProvider } from "@/store/options/options-provider";
import { RoomStoreProvider } from "@/store/room/room-provider";
import { SaveMovesStoreProvider } from "@/store/saveMoves/saveMoves-provider";
import { UsersStoreProvider } from "@/store/users/users-provider";

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return (
    <OptionsStoreProvider>
      <UsersStoreProvider>
        <RoomStoreProvider>
          <ModalStoreProvider>
            <SaveMovesStoreProvider>{children}</SaveMovesStoreProvider>
          </ModalStoreProvider>
        </RoomStoreProvider>
      </UsersStoreProvider>
    </OptionsStoreProvider>
  );
};
