import axios from "axios";

export const Api = axios.create({
	// @ts-ignore
	baseURL: import.meta.env.VITE_BASE_URL_API
});
