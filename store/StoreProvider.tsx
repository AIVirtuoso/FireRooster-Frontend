"use client";
import { createContext, useContext, useState, useRef } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { makeStore, AppStoreType } from "@/store";

interface StoreContextProps {
  currentStateName: string;
  setCurrentStateName: (name: string) => void;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStateName, setCurrentStateName] = useState<string>("");
  const storeRef = useRef<AppStoreType>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <ReduxProvider store={storeRef.current}>
      <StoreContext.Provider value={{ currentStateName, setCurrentStateName }}>
        {children}
      </StoreContext.Provider>
    </ReduxProvider>
  );
}

export const useStore = (): StoreContextProps => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
