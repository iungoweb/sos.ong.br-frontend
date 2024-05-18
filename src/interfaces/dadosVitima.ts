import UUIDService from "../services/UUIDService";
import Cidade from "./cidade";

export interface DadosVitima {
	idExterno: string,
	id?: string,
	nome?: string,
	telefone?: number,
	localEndereco?: string,
	cidadeId?: number,
	cidadeNome?: string,
	qntPessoas?: number,
	qntAnimais?: number,
	ilhados?: boolean,
	isolados?: boolean,
	soterrados?: boolean,
	desabrigados?: boolean,
	cidade?: Cidade
}

export const DadosPadroesVitima: DadosVitima = {
	idExterno    : UUIDService.getUUIDUsuario(),
	nome         : null,
	telefone     : null,
	localEndereco: null,
	cidadeId     : null,
	cidadeNome   : null,
	qntPessoas   : null,
	qntAnimais   : null,
	ilhados      : false,
	isolados     : false,
	soterrados   : false,
	desabrigados : false
};