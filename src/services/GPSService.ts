export interface DadosGPS {
	longitude: number,
	latitude: number,
	precisao: number,
	dataHora: number,
}

export interface OpcoesPosicao {
	enableHighAccuracy?: boolean, // Ativa alta precisão
	timeout?: number, // Tempo limite para a obter da localização (em milissegundos)
	maximumAge?: number, // Tempo máximo em que uma localização anterior pode ser usada (em milissegundos)
}

class GPSService {

	private configuracao: OpcoesPosicao = {
		enableHighAccuracy: true, // Ativa alta precisão
		timeout           : 10000, // 10 seg - Tempo limite para a obter da localização (em milissegundos)
		maximumAge        : 300000 // 5 min - Tempo máximo em que uma localização anterior pode ser usada (em milissegundos)
	};

	erroNavegadorSemSuporte: Error = new Error("Seu navegador não tem suporte a localização");

	public recuperarLocalizacao = (opcoes?: OpcoesPosicao): Promise<DadosGPS> => {

		const mergeOpcoes: OpcoesPosicao = { ...this.configuracao, ...opcoes };

		return new Promise((resolve, reject): void => {

			if (!navigator.geolocation)
				reject(this.erroNavegadorSemSuporte);

			navigator.geolocation.getCurrentPosition(
				(posicao: GeolocationPosition): void => {
					resolve({
						latitude : posicao.coords.latitude,
						longitude: posicao.coords.longitude,
						precisao : posicao.coords.accuracy,
						dataHora : posicao.timestamp
					});
				},
				(erro: GeolocationPositionError): void => {
					reject(erro);
				},
				mergeOpcoes
			);
		});
	};

	public getLocalizacaoMelhorPrecisao = (atual: DadosGPS, nova: DadosGPS): DadosGPS => {

		if (atual.precisao <= nova.precisao)
			return atual;

		return nova;
	};
}

export default new GPSService();