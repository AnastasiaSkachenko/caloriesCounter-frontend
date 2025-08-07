import { axiosPrivate } from "../utils/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { DiaryRecord, DiaryRecordInput } from "../components/interfaces";
import Cookies from "universal-cookie"; 
import { handleError } from "../utils/utils";

const cookies = new Cookies();



const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const {auth} = useAuth()


    const saveDiaryRecord = async ({diaryRecord}: DiaryRecordInput): Promise<void> => {
      await axiosPrivate.post(`/diary-record/`, diaryRecord);
    }

    const fetchDiaryRecords = async ()  => { 
    let accessToken = auth?.access;

    if (!accessToken) {
        console.log("Access token missing, attempting refresh...");
        accessToken = await refresh();
    }
    
    if (!accessToken) {
        console.error("Failed to obtain access token");
        return [];
    }
    
    const response = await axiosPrivate.get(`diary-record/`, {
			headers: {
			"Content-Type": "application/json",
			'Authorization': `Bearer ${accessToken}`,
			'X-CSRFToken': cookies.get("csrftoken")
			},
    });     
      const data = await response.data
      const diaryRecords:DiaryRecord[] = data.diaryRecords
      return diaryRecords ?? []
    };
    

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // If no authorization header, add the token from auth context
                if (!config.headers['Authorization']  ) {
                    config.headers['Authorization'] = `Bearer ${auth.access}`;
                    const refresh_token = cookies.get("refresh_token")
                    config.headers['refresh'] = refresh_token
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
                            const refresh_token = cookies.get("refresh_token")
                            prevRequest.headers['refresh'] = refresh_token
        
                            // Retry the request with the new token
 
                            return axiosPrivate(prevRequest);
                        }
                    } catch (error) {
                        handleError(error)
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
    }, [auth.access, refresh]); // Dependency on auth.access and refresh

    return {axiosPrivate, saveDiaryRecord, fetchDiaryRecords};
}

export default useAxiosPrivate;
