import { axiosPrivate } from "../utils/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // If no authorization header, add the token from auth context
                if (!config.headers['Authorization'] && auth?.access) {
                    config.headers['Authorization'] = `Bearer ${auth?.access}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;

                // Retry the request if the response is 403 (token expired)
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;  // Mark request as sent to avoid multiple retries

                    try {
                        const newAccessToken = await refresh(); // Refresh the token

                        if (newAccessToken) {
                            // Set the new access token to the headers
                            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                            // Retry the request with the new token
                            console.log('lallalala')
                            return axiosPrivate(prevRequest);
                        }
                    } catch (error) {
                        console.error('Failed to refresh token:', error);
                    }
                }
                return Promise.reject(error); // Reject the error if token refresh fails or not expired
            }
        );

        return () => {
            // Clean up interceptors on component unmount
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth?.access, refresh]); // Dependency on auth.access and refresh

    return axiosPrivate;
}

export default useAxiosPrivate;
