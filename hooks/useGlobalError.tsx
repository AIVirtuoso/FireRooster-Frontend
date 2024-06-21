import { useState } from "react";

export const useErrorMessage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleError = (error: any) => {
    const message = error.message || "An unexpected error occurred";
    setErrorMessage(message);
    console.error(error);
  };

  const clearErrorMessage = () => setErrorMessage("");

  return { errorMessage, handleError, clearErrorMessage };
};
