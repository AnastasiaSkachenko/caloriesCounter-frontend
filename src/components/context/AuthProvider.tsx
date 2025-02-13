import  { createContext, ReactNode, useState } from "react";

const AuthContext = createContext({});

interface AuthProviderProps {
    children: ReactNode;
  }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;