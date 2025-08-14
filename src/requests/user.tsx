import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { axiosPrivate, axiosPublic } from "../utils/axios";

 
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (user: FormData) => {
    setLoading(true);  // Start loading
    setError(null);  // Clear previous errors
    try {
      await axiosPublic.post('/register/', user, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });


      setLoading(false);  // Stop loading after the request
    } catch {
      setLoading(false);  // Stop loading on error
      setError("Error while creating user");  // Handle error state
    }
  };

  return {
    register,
    loading,
    error,
  };
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuth()

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosPublic.post("/token/",  { email, password });
      setAuth({user: response.data.user, access: response.data.access})
      
    } catch (err) {
      setError("Login failed, please try again");
      console.error("Login failed", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { login, isLoading, error };
};

 
export const useUser = () => {
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State for any errors
  const {axiosPrivate} = useAxiosPrivate()
  const { setAuth }  = useAuth()


  const fetchUser = async () => {
    try {
      const response = await axiosPrivate.get("/user/", {
        withCredentials: true, 
      });
      setAuth({user: response.data.user, access: response.data.access})
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setError("Failed to fetch user"); // Set error state
    } finally {
      setLoading(false); // Set loading to false once request is complete
    }
  };


  return {  loading, error, refetch: fetchUser };  
};

export const useModify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuth()

  const modify = async (user: FormData, recalculate: boolean) => {
    setLoading(true);  // Start loading
    setError(null);  // Clear previous errors

    try {
      const response = await axiosPrivate.put(`/modify-user/?recalculate=${recalculate}`, user);

      setAuth(prev => ({...prev, user: response.data.user}))

      console.log('user is set to', response.data.user)


      setLoading(false);  // Stop loading after the request
    } catch  {
      setLoading(false);  // Stop loading on error
      setError("Error while updating user");  // Handle error state
    }
  };

  return {
    modify,
    loading,
    error,
  };
};


 
export const useLogout = () => {
  const { setAuth }  = useAuth()


  const logout = async () => {
    try {
      await axiosPrivate.post("/logout/");
      setAuth({})
 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return { logout };
};



export const sendVerificationCode = async (email: string) => {
  return axiosPublic.post(`/send-code/`, { email });
};

export const verifyCode = async (email: string, code: string) => {
  return axiosPublic.post(`/verify-code/`, { email, code });
};
 
export const resetPassword = async (email: string, newPassword: string) => {
  return axiosPublic.post(`/reset-password/`, { email, new_password: newPassword });
};


