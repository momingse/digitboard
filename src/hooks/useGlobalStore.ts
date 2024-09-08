import { useRef, useCallback } from "react";

type Store = Readonly<{
  [key: string]: any;
}>;

const createStore = (): Store => Object.freeze({});

const setValue = (store: Store, key: string, value: any): Store =>
  Object.freeze({ ...store, [key]: value });

const getValue = (store: Store, key: string): any => store[key];

const createGlobalStore = () => {
  let store: Store = createStore();

  const getStore = () => store;

  const setStoreValue = (key: string, value: any) => {
    store = setValue(store, key, value);
  };

  const getStoreValue = (key: string) => getValue(store, key);

  return { getStore, setStoreValue, getStoreValue };
};

export const globalStore = createGlobalStore();

export function useGlobalStore<T>(key: string, initialValue?: T) {
  const value = useRef<T>(globalStore.getStoreValue(key) ?? initialValue);

  if (globalStore.getStoreValue(key) === undefined) {
    globalStore.setStoreValue(key, initialValue);
  }

  return value;
}
