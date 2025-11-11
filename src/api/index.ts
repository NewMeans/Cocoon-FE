import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL ?? "https://aneuk-api.dev-lr.com";

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	(config) => {
		const token = Cookies.get("userToken");
		if (!token) {
			console.error("No user token found in cookies.");
			window.location.replace("/login");
			return Promise.reject(new Error("Authorization token is missing"));
		}
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error.response || error.message);
		if (error.response && error.response.status === 403) {
			console.error("Token is invalid or expired. Redirecting to login.");
			Cookies.remove("userToken");
			Cookies.remove("userEmail");
			window.location.replace("/login");
		}
		return Promise.reject(error);
	}
);

export default apiClient;
