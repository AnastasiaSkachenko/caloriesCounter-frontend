import { createContext, useState, ReactNode, Dispatch, SetStateAction, useLayoutEffect, useEffect } from "react";
import { User } from "../components/interfaces";
import { axiosPrivate } from "../utils/axios";

interface AuthContextType {
    auth: { user?: User; accessToken?: string };
    setAuth: Dispatch<SetStateAction<{ user?: User; accessToken?: string }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<{ user?: User; accessToken?: string }>({});
    console.log(auth)


    useEffect(() => {
      const refresh = async () => {    
          try {
              const response = await axiosPrivate.post("/api/token/refresh/");
              setAuth(prev => ({
                  ...prev,
                  accessToken: response.data.access,
              }));

              return response.data.accessToken;
          } catch (error) {
              console.error("Failed to refresh token:", error);
              return null;
          }
      };

      if (!auth.accessToken) {
        refresh()
      }

    }, [])



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosPrivate.get("/api/user/", {
                    withCredentials: true,
                });
                setAuth(prev => ({
                    ...prev,
                    user: response.data.user,
                    accessToken: response.data.access ?? prev.accessToken,
                }));
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        // Only fetch user if there's no user or accessToken
        if (auth.accessToken && !auth.user) {
            fetchUser();
        }

 

    }, [auth, auth.accessToken, auth.user]); // Runs when auth changes (accessToken or user)

    useLayoutEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            async (config) => {
                // If access token exists, always add to header
                if (auth.accessToken) {
                    console.log('Adding Authorization header');
                    config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
        };
    }, [auth.accessToken]); 


    useLayoutEffect(() => {
        const refresh = async () => {
            try {
                const response = await axiosPrivate.get("/refresh", {
                    withCredentials: true,
                });

                setAuth(prev => ({
                    ...prev,
                    accessToken: response.data.access,
                }));

                return response.data.accessToken;
            } catch (error) {
                console.error("Failed to refresh token:", error);
                return null;
            }
        };

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;

                // Handle 403 (Forbidden) - Token expired
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();

                    if (!newAccessToken) {
                        console.error("Refresh failed, logging out...");
                        setAuth({});
                        return Promise.reject(error);
                    }

                    prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest); // Retry the original request with new token
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth.accessToken]); // Trigger effect when accessToken is available

    return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
