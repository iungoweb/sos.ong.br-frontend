import { Api } from "../provider/Api";
import { DadosSocorrista } from "../interfaces/dadosSocorrista";
import Cidade from "../interfaces/cidade";
import { DadosVitima } from "../interfaces/dadosVitima";
import { EstadoSocorro } from "../enums/EstadoSocorro";

const recuperarCidadesComPedidosSocorro = (uf: string) => Api.get("/cidades-com-resgate/" + uf);

const salvarDados = (socorrista: DadosSocorrista) => Api.post("/socorrista/dados", socorrista);

const recuperarPedidosSocorroCidade = (cidade: Cidade) => Api.get("/pedidos-socorro-cidade/" + cidade.id);

const socorrerVitima = (socorrista: DadosSocorrista, vitima: DadosVitima) => Api.put(
	"/socorrista/socorrer",
	{
		socorristaId: socorrista.idExterno,
		vitimaId    : vitima.id,
	});

const atualizarEstadoSocorro = (estado: EstadoSocorro, dadosVitima: DadosVitima) => Api.put(
	'/socorro',
	{
		estado,
		idVitima: dadosVitima.id ?? dadosVitima.idExterno
	}
)

export default {
	recuperarCidadesComPedidosSocorro,
	salvarDados,
	recuperarPedidosSocorroCidade,
	socorrerVitima,
	atualizarEstadoSocorro
};