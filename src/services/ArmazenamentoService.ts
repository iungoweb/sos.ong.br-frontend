// Criado por IA
// Criado por IA
// Criado por IA

interface OpcoesArmazenamento {
	expires?: number | Date;
	path?: string;
	domain?: string;
	secure?: boolean;
	sameSite?: "strict" | "lax" | "none";
}

class ArmazenamentoService {

	constructor(
		private cookieOptions: OpcoesArmazenamento = {
			expires : 31536000, // Um ano
			secure  : true,
			sameSite: "strict"
		}
	) {}

	private setCookie(name: string, value: string, options: OpcoesArmazenamento = {}) {

		const mergedOptions = { ...this.cookieOptions, ...options };

		let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

		if (mergedOptions.expires) {
			if (mergedOptions.expires instanceof Date) {
				cookieString += `; expires=${mergedOptions.expires.toUTCString()}`;
			} else {
				const expires = new Date(Date.now() + mergedOptions.expires * 1000);
				cookieString += `; expires=${expires.toUTCString()}`;
			}
		}

		if (mergedOptions.path) {
			cookieString += `; path=${mergedOptions.path}`;
		}

		if (mergedOptions.domain) {
			cookieString += `; domain=${mergedOptions.domain}`;
		}

		if (mergedOptions.secure) {
			cookieString += `; secure`;
		}

		if (mergedOptions.sameSite) {
			cookieString += `; samesite=${mergedOptions.sameSite}`;
		}

		document.cookie = cookieString;
	}

	private getCookie(name: string): string | null {
		const cookies = document.cookie.split(";");

		for (let cookie of cookies) {
			const [cookieName, cookieValue] = cookie.split("=").map(c => c.trim());

			if (decodeURIComponent(cookieName) === name) {
				return decodeURIComponent(cookieValue);
			}
		}

		return null;
	}

	insere(key: string, value: string, options?: OpcoesArmazenamento) {
		this.setCookie(key, value, options);
	}

	atualiza(key: string, value: string, options?: OpcoesArmazenamento) {
		this.insere(key, value, options);
	}

	seleciona(key: string): string | null {
		return this.getCookie(key);
	}

	deleta(key: string, options?: OpcoesArmazenamento) {
		this.setCookie(key, "", { expires: -1, ...options });
	}
}

export default new ArmazenamentoService();