import axios from "axios";
import { baseUrl } from "./production";
import Cookies from "universal-cookie"; // Import universal-cookie

const cookies = new Cookies()

export const axiosPublic = axios.create({
	baseURL: baseUrl,
	withCredentials: true,
	headers: {
		"X-CSRFToken": cookies.get('csrftoken'),
		'X-App-Source': 'web'

	},
});
  
  
export const axiosPrivate = axios.create({
	baseURL: baseUrl,
	withCredentials: true,
	
	headers: {
		"X-CSRFToken": cookies.get('csrftoken'),
		'X-App-Source': 'web'

	},
});
