import { useEffect, useState } from "react";

export const useCheckAuth = () => {
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== undefined && window.localStorage) {
      const token = localStorage.getItem("auth");
      if (!token) setIsAuth(false);
    }
  }, []);

  return { isAuth };
};
