import axios, { AxiosResponse } from 'axios';

interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}

class APIService {

	private readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async get<T>(url: string): Promise<T> {
		const response: AxiosResponse<ApiResponse<T>> = await axios.get<ApiResponse<T>>(`${this.baseUrl}${url}`);
		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error(response.data.message);
		}
	}

	// Método para fazer uma requisição POST genérica
	async post<T>(url: string, data: any): Promise<T> {
		const response: AxiosResponse<ApiResponse<T>> = await axios.post<ApiResponse<T>>(`${this.baseUrl}${url}`, data);
		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error(response.data.message);
		}
	}

	// Adicione outros métodos conforme necessário (PUT, DELETE, etc.)
}

// Exporte uma instância do serviço
export const apiService = new APIService(import.meta.env.VITE_BASE_URL_API);
