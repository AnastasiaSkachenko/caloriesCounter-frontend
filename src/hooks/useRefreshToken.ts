import { axiosPrivate } from '../utils/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axiosPrivate.post('/api/token/refresh/', {}, { withCredentials: true });
            const newAccessToken = response.data.access;
            
            setAuth(prev => {
                console.log('Old auth state:', JSON.stringify(prev));
                console.log('New access token:', newAccessToken);
                return { ...prev, access: newAccessToken };
            });

            return newAccessToken;  // Return new access token for retry
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }
    }

    return refresh;
};

export default useRefreshToken;
