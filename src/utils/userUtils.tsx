import { useState } from "react";
import { axiosPrivate, axiosPublic } from "./axios";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";



 
 
 
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (user: FormData) => {
    setLoading(true);  // Start loading
    setError(null);  // Clear previous errors
    try {
      await axiosPublic.post('/api/register/', user, {
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
      const response = await axiosPublic.post("/api/token/",  { email, password });
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
  const axiosPrivate = useAxiosPrivate()
  const { setAuth }  = useAuth()


  const fetchUser = async () => {
    try {
      const response = await axiosPrivate.get("/api/user/", {
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


  const modify = async (user: FormData) => {
    setLoading(true);  // Start loading
    setError(null);  // Clear previous errors

    try {
      const response = await axiosPrivate.put('/api/modify-user/', user, {
      });

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
  const axiosPrivate = useAxiosPrivate()
  const { setAuth }  = useAuth()


  const logout = async () => {
    try {
      await axiosPrivate.post("/api/logout/");
      setAuth({})
 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return { logout };
};


 


