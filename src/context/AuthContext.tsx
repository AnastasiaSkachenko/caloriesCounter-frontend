import { createContext, Dispatch, SetStateAction, useContext, useEffect } from "react";
import { User } from "../components/interfaces";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
    auth: {user?: User, accessToken?: string};
    setAuth: Dispatch<SetStateAction<{ user?: User; accessToken?: string }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a UserProvider");
  }

  const { user, setUser } = context;

  // If there is no user, attempt to fetch the user
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled:  !user,  // Trigger only when accessToken exists and user is null
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data, setUser]);

  // Refetch the user if not available
  useEffect(() => {
    if (!user) {
      refetch();
    }
  }, [user, refetch]);

  return { user, isLoading, isError };
};

