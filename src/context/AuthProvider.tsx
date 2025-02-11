import { createContext, useState, ReactNode, Dispatch, SetStateAction, useLayoutEffect, useEffect } from "react";
import { User } from "../components/interfaces";
import { axiosPrivate } from "../utils/axios";

interface AuthContextType {
    auth: { user?: User; access?: string };
    setAuth: Dispatch<SetStateAction<{ user?: User; access?: string }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<{ user?: User; access?: string }>({});
    const [retry, setRetry] = useState(false)
    console.log(auth)


    useEffect(() => {
      const refresh = async () => {   
          try {
              const response = await axiosPrivate.post("/api/token/refresh/");
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
                    access: response.data.access ?? prev.access,
                }));
                console.log(response.data)
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
              console.log(config, 'config')
              console.log('retry    ', retry)
                // If access token exists, always add to header
                if (auth.access && !retry) {
                    console.log('Adding Authorization header', auth.access);
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
            const response = await axiosPrivate.post("/api/token/refresh/",   { withCredentials: true });

            const newAccessToken = response.data.access

            setAuth(prev => ({
                ...prev,
                access: newAccessToken,
            }));
            console.log('auth should get new access token', auth)
            console.log(newAccessToken)
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
                console.log('Updated Authorization:', prevRequest.headers["Authorization"]);
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
}, [auth.access]); // Trigger effect when accessToken is available

return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;


    return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
