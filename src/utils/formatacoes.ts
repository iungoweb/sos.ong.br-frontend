export const Formatacoes = {
	numeroTelefone(telefone: string | number): string {

		if (typeof telefone === "number")
			telefone = telefone.toString();

		if (!telefone)
			return "";

		switch (telefone.length) {
			case 13:
				return telefone.replace(/([0-9]{2})([0-9]{2})([0-9]{5})([0-9]{4})/, "$1 $2 $3 $4");

			case 12:
				return telefone.replace(/([0-9]{2})([0-9]{2})([0-9]{4})([0-9]{4})/, "$1 $2 $3 $4");

			case 11:
				return telefone.replace(/([0-9]{2})([0-9]{5})([0-9]{4})/, "$1 $2 $3");

			case 10:
				return telefone.replace(/([0-9]{2})([0-9]{4})([0-9]{4})/, "$1 $2 $3");

			case 9:
				return telefone.replace(/([0-9]{5})([0-9]{4})/, "$1 $2");

			case 8:
				return telefone.replace(/([0-9]{4})([0-9]{4})/, "$1 $2");

			default:
				return telefone;
		}
	}
};