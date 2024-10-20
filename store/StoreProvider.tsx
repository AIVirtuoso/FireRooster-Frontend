"use client";
import { createContext, useContext, useState, useRef } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { makeStore, AppStoreType } from "@/store";

interface StoreContextProps {
  currentStateName: string;
  setCurrentStateName: (name: string) => void;
  currentScanners: string;
  setCurrentScanners: (scanners: string) => void;
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  currentStars: number;
  setCurrentStars: (stars: number) => void;
  headSearch: string;
  setHeadSearch: (headSearch: string) => void;
  decSearch: string;
  setDecSearch: (decSearch: string) => void;
  alertIdSearch: number,
  setAlertIdSearch: (alertIdSearch: number) => void;
  selectedFrom: Date | null,
  setSelectedFrom: (selectedFrom: Date | null) => void;
  selectedTo: Date | null,
  setSelectedTo: (selectedTo: Date | null) => void;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const [currentStateName, setCurrentStateName] = useState<string>("");
  const [currentScanners, setCurrentScanners] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<string>("ALL");
  const [currentStars, setCurrentStars] = useState<number>(0);
  const [headSearch, setHeadSearch] = useState("");
  const [decSearch, setDecSearch] = useState("");
  const [alertIdSearch, setAlertIdSearch] = useState(0);
  const [selectedFrom, setSelectedFrom] = useState<Date | null>(null);
  const [selectedTo, setSelectedTo] = useState<Date | null>(null);
  const storeRef = useRef<AppStoreType>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <ReduxProvider store={storeRef.current}>
      <StoreContext.Provider
        value={{
          currentStateName,
          setCurrentStateName,
          currentScanners,
          setCurrentScanners,
          currentCategory,
          setCurrentCategory,
          currentStars,
          setCurrentStars,
          decSearch,
          setDecSearch,
          headSearch,
          setHeadSearch,
          alertIdSearch,
          setAlertIdSearch,
          selectedFrom,
          setSelectedFrom,
          selectedTo,
          setSelectedTo
        }}
      >
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
