import { createContext, useState, ReactNode, Dispatch, SetStateAction, useLayoutEffect, useEffect } from "react";
import { User } from "../components/interfaces";
import { axiosPrivate } from "../utils/axios";

interface AuthContextType {
    auth: { user?: User; access?: string, favoriteDishes?: number[] };
    setAuth: Dispatch<SetStateAction<{ user?: User; access?: string, favoriteDishes?: number[]}>>;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<{ user?: User; access?: string, favoriteDishes?: number[] }>({});
    const [retry, setRetry] = useState(false)
    

    console.log(auth)


    useEffect(() => {
      const refresh = async () => {   
          try {
              const response = await axiosPrivate.post("/token/refresh/");
              setAuth(prev => ({
                  ...prev,
                  access: response.data.access,
              }));

              return response.data.access;
          } catch (error) {
              console.error("Failed to refresh token:", error);
              return null;
          }
      };

      if (!auth.access) {
        refresh()
      }

    }, [auth.access])

    const refreshUser = async () => {  // Function to refresh user details
        try {
            const response = await axiosPrivate.get("/user/", {
                withCredentials: true,
            });
            setAuth(prev => ({
                ...prev,
                user: response.data.user,
                access: response.data.access ?? prev.access,
                favoriteDishes: response.data.favoriteDishes
            }));
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosPrivate.get("/user/", {
                    withCredentials: true,
                });
                setAuth(prev => ({
                    ...prev,
                    user: response.data.user,
                    access: response.data.access ?? prev.access,
                    favoriteDishes: response.data.favoriteDishes
                }));
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        // Only fetch user if there's no user or accessToken
        if (auth.access && !auth.user) {
            fetchUser();
        }
    }, [auth, auth.access, auth.user]); // Runs when auth changes (accessToken or user)

    useLayoutEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            async (config) => {
                // If access token exists, always add to header
                if (auth.access && !retry) {
                    config.headers["Authorization"] = `Bearer ${auth.access}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
        };
    }, [auth.access, retry]); 

    useLayoutEffect(() => {
    const refresh = async () => {
        try {
            const response = await axiosPrivate.post("/token/refresh/",   { withCredentials: true });

            const newAccessToken = response.data.access

            setAuth(prev => ({
                ...prev,
                access: newAccessToken,
            }));
            return newAccessToken;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            return null;
        }
    };

    const responseIntercept = axiosPrivate.interceptors.response.use(
        (response) => response, // Handle the successful response
        async (error) => {
            const prevRequest = error.config;
            // Handle 403 (Forbidden) - Token expired
            if (error?.response?.status === 403 && !prevRequest?.sent && error?.response?.method != 'PUT') {
                prevRequest.sent = true;  // Mark the request as sent
                const newAccessToken = await refresh(); // Try to refresh the token
                
                if (!newAccessToken) {
                    console.error("Refresh failed, logging out...");
                    setAuth({});
                    return Promise.reject(error);  // Reject the request if refresh fails
                }

                // Update the Authorization header with the new token
                prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                setRetry(true)
                // Retry the original request with the new access token
                return axiosPrivate(prevRequest);
            }

            return Promise.reject(error);  // Reject the error if it's not token expiration
        }
    );

    return () => {
        // Clean up the interceptor when component unmounts
        axiosPrivate.interceptors.response.eject(responseIntercept);
    };
}, [auth.access, auth]); // Trigger effect when accessToken is available

return <AuthContext.Provider value={{ auth, setAuth, refreshUser }}>{children}</AuthContext.Provider>;

};

export default AuthContext;
