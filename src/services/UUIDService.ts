import ArmazenamentoService from "./ArmazenamentoService";

class UUIDService {

	static gerarV4(): string { // Gerado por IA
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0;
			const v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	static getUUIDUsuario(): string {

		const salvo = ArmazenamentoService.seleciona("uuid")
		if (salvo && salvo.length > 1)
			return salvo

		const novoUUID = this.gerarV4()
		ArmazenamentoService.insere("uuid", novoUUID)
		return novoUUID
	}
}

export default UUIDService;