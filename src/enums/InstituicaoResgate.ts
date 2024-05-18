export enum InstituicaoResgate {
	BOMBEIROS                = 1,
	DEFESA_CIVIL             = 2,
	FORCAS_ARMADAS_NACIONAIS = 3, // Exército / Marinha / Aeronáutica
	CRUZ_VERMELHA            = 4,
	OUTRO_GOVERNAMENTAL      = 5,
	OUTRO                    = 6,
}

export const getDescricao = (instituicao: InstituicaoResgate): string => {
	switch (instituicao) {
		case InstituicaoResgate.BOMBEIROS:
			return "Bombeiros";

		case InstituicaoResgate.DEFESA_CIVIL:
			return "Defesa civil";

		case InstituicaoResgate.FORCAS_ARMADAS_NACIONAIS:
			return "Exército / Marinha / Aeronáutica";

		case InstituicaoResgate.CRUZ_VERMELHA:
			return "Cruz vermelha";

		case InstituicaoResgate.OUTRO_GOVERNAMENTAL:
			return "Outro governamental";

		case InstituicaoResgate.OUTRO:
			return "Outro";

		default:
			return "---";
	}
};

interface ObjInstituicaoResgate {
	id: number,
	nome: string,
}

export const getTodasInstituicoesResgate = (): ObjInstituicaoResgate[] => {

	let instituicoes: ObjInstituicaoResgate[] = [];

	Object
	.values(InstituicaoResgate)
	.forEach((i: InstituicaoResgate|string): void => {

		if (typeof i != "number")
			return;

		instituicoes.push({
			id  : i.valueOf(),
			nome: getDescricao(i)
		});
	});

	return instituicoes;
};