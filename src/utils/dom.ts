export function atualizarMetaDescription(conteudo: string): void {

	// @ts-ignore
	let metaDescription = document.querySelector("meta[name=\"description\"]");
	let adicionar       = false;

	if (conteudo.length === 0 && metaDescription) {
		metaDescription.remove();
		return;
	}

	if (!metaDescription) {
		adicionar       = true;
		metaDescription = document.createElement("meta");
		metaDescription.setAttribute("name", "description");
	}
	metaDescription.setAttribute("content", "" + conteudo);

	if (adicionar)
		document.head.appendChild(metaDescription);
}