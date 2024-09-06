"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createWealthStore } from "@/lib/store";
import type { StoreInterface } from "@/lib/store";

export type WealthStoreApi = ReturnType<typeof createWealthStore>;

export const WealthStoreContext = createContext<WealthStoreApi | undefined>(
  undefined
);

export interface WealthStoreProviderProps {
  children: ReactNode;
}

export const WealthStoreProvider = ({ children }: WealthStoreProviderProps) => {
  const storeRef = useRef<WealthStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createWealthStore();
  }

  return (
    <WealthStoreContext.Provider value={storeRef.current}>
      {children}
    </WealthStoreContext.Provider>
  );
};

export const useWealthStore = <T,>(
  selector: (store: StoreInterface) => T
): T => {
  const wealthStoreContext = useContext(WealthStoreContext);

  if (!wealthStoreContext) {
    throw new Error(`useWealthStore must be used within WealthStoreProvider`);
  }

  return useStore(wealthStoreContext, selector);
};
