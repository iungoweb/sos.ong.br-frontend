import { Api } from "../provider/Api";
import { DadosGPS } from "./GPSService";
import { DadosVitima } from "../interfaces/dadosVitima";
import UUIDService from "./UUIDService";

const salvarLocalizacao = (localizacao: DadosGPS) => Api.put(
	"/localizacao",
	{
		"idExterno"  : UUIDService.getUUIDUsuario(),
		"localizacao": {
			...localizacao,
			dataHora: Math.round(localizacao.dataHora / 1000)
		}
	}
);

const salvarQuemSeraSocorrido = (proprioUsuario: boolean) => Api.put(
	"/pedido-socorro/socorrido",
	{
		"idExterno"   : UUIDService.getUUIDUsuario(),
		"paraTerceiro": !proprioUsuario
	}
);

const recuperarCidadesPorUF = (uf: string) => Api.get("/cidades/" + uf);

const salvarDemaisDados = (vitima: DadosVitima) => Api.post("/pedido-socorro/dados", {
	...vitima,
	idExterno: UUIDService.getUUIDUsuario()
});

const recuperarDadosVitima = (vitima: DadosVitima) => Api.get("/vitima/" + (vitima.id ?? vitima.idExterno))

export default {
	salvarLocalizacao,
	salvarQuemSeraSocorrido,
	recuperarCidadesPorUF,
	salvarDemaisDados,
	recuperarDadosVitima
};