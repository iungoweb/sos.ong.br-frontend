import ArmazenamentoService from "../services/ArmazenamentoService";
import { InstituicaoResgate } from "../enums/InstituicaoResgate";

export interface DadosSocorrista {
	idExterno: string,
	nome: string,
	telefone: number,
	temGrupo: boolean,
	instituicaoResgate: InstituicaoResgate,
}

export const DadosPadroesSocorrista: DadosSocorrista = {
	idExterno         : ArmazenamentoService.seleciona("uuid"),
	nome              : null,
	telefone          : null,
	temGrupo          : null,
	instituicaoResgate: null
};