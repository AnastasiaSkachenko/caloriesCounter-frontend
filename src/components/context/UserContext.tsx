import { createContext, useContext } from "react";
import { User } from "../interfaces";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {

    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};
