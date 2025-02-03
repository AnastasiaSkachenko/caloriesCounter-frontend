import axios from "axios";
import { baseUrl } from "./production";
import Cookies from "universal-cookie"; // Import universal-cookie
import { useUserContext } from "../components/context/UserContext";
import { useState } from "react";


const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
 
// Define the hook
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (user: FormData) => {
    setLoading(true);  // Start loading
    setError(null);  // Clear previous errors
    try {
      await axiosInstance.post('/api/register/', user, {
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
  const { setUser } = useUserContext();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/api/login/", { email, password });
      cookies.set("accessToken", res.data.access, { path: "/", maxAge: 259200 });

      setUser(res.data.user); // Update user in context
    } catch (err) {
      setError("Login failed, please try again");
      console.error("Login failed", err);
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};

 
export const useModify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUserContext();


  const modify = async (user: FormData) => {
    const token = cookies.get("accessToken");  // Get the JWT token from cookies


    setLoading(true);  // Start loading
    setError(null);  // Clear previous errors

    try {
      const response = await axiosInstance.put('/api/modify-user/', user, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
          'Content-Type': 'multipart/form-data',
          refresh_token: cookies.get("refreshToken"), 
        },
      });

      setUser(response.data.user)
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
  const { setUser } = useUserContext();

  const logout = async () => {
    try {
      // Optionally, call your backend to invalidate the session if needed
      await axiosInstance.post("/api/logout/", {
        refresh_token: cookies.get("refreshToken"), // Optional if you have a refresh token
      });

      // Remove the access token and refresh token from cookies
      cookies.remove("accessToken", { path: "/" });
      cookies.remove("refreshToken", { path: "/" });

      // Reset the user state in context
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return { logout };
};


