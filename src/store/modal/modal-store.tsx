import { createStore } from "zustand";

export type ModalState = {
  modal: JSX.Element | JSX.Element[];
  opened: boolean;
};

export type ModalActions = {
  openModal: (modal: JSX.Element | JSX.Element[]) => void;
  closeModal: () => void;
};

export type ModalStore = ModalState & ModalActions;

export const defaultInitialModalState: ModalState = {
  modal: <></>,
  opened: false,
};

export const createModalStore = (
  initState: ModalState = defaultInitialModalState,
) => {
  return createStore<ModalStore>((set) => ({
    ...initState,
    openModal: (modal: JSX.Element | JSX.Element[]) =>
      set({ modal, opened: true }),
    closeModal: () => set({ modal: <></>, opened: false }),
  }));
};
