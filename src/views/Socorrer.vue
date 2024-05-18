<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import ModalConfirmacao from "../components/modal/ModalConfirmacao.vue";
import ArmazenamentoService from "../services/ArmazenamentoService";
import { useRoute, useRouter } from "vue-router";
import { DadosPadroesSocorrista, DadosSocorrista } from "../interfaces/dadosSocorrista";
import { getTodasInstituicoesResgate } from "../enums/InstituicaoResgate";
import SocorristaService from "../services/SocorristaService";
import Cidade from "../interfaces/cidade";
import { DadosVitima } from "../interfaces/dadosVitima";
import VitimaService from "../services/VitimaService";
import { Formatacoes } from "../utils/formatacoes";
import { EstadoSocorro } from "../enums/EstadoSocorro";


// Globais
const route  = useRoute(),
	  router = useRouter();

// Dados
const etapa               = ref(1),
	  dadosSocorrista     = ref<DadosSocorrista>({
		  ...DadosPadroesSocorrista
	  }),
	  cidadesComResgate   = ref<Cidade[]>([]),
	  vitimasParaSocorrer = ref<DadosVitima[]>([]),
	  vitimaSelecionada   = ref<DadosVitima>(),
	  vitimaASerSocorrida = ref<DadosVitima>();

// Métodos
const recuperarEtapaAtual = () => {

	if (route.query.etapa === undefined || route.query.etapa.length === 0) {

		if (ArmazenamentoService.seleciona("socorrerEtapa"))
			etapa.value = parseInt(ArmazenamentoService.seleciona("socorrerEtapa"));

	} else {

		etapa.value = typeof route.query.etapa == "object"
					  ? parseInt(route.query.etapa[0])
					  : parseInt(route.query.etapa);
	}

	if (etapa.value <= 0)
		etapa.value = 1;
};

const atualizarEtapa = (novaEtapa?: number) => {

	if (novaEtapa)
		etapa.value = novaEtapa;

	// Atualizando no parâmetro da URL
	router.push({
		path : route.path,
		query: {
			...route.query,
			etapa: etapa.value
		}
	});

	// Salva no armazenamento local
	ArmazenamentoService.insere("pedidoSocorroEtapa", etapa.value);
};

const avancarEtapa = () => {
	etapa.value++;
	atualizarEtapa();
};

const retrocederEtapa = () => {

	if (etapa.value <= 1)
		return;

	etapa.value--;
	atualizarEtapa();
};

const salvarDados = () => {
	SocorristaService
	.salvarDados(dadosSocorrista.value)
	.then(() => {
		avancarEtapa();
	})
	.catch((erro) => {
		alert(erro.response?.data?.msg ?? "Erro desconhecido ao salvar os dados, recarregue a página e tente novamente.");
	});
};

const recuperarCidadesRSComResgate = () => {
	SocorristaService
	.recuperarCidadesComPedidosSocorro("RS")
	.then((response) => {
		cidadesComResgate.value = response.data;
	})
	.catch((erro) => {
		if (erro.response?.status === 404)
			alert("Não existe nenhuma solicitação de resgate para o RS no nosso sistema.");
		else
			alert(erro.response?.data?.msg ?? "Erro desconhecido ao recuperar cidades do RS com resgate, recarregue a página e tente novamente.");
	});
};

const selecionarCidade = (cidade: Cidade) => {
	SocorristaService
	.recuperarPedidosSocorroCidade(cidade)
	.then((resposta) => {
		vitimasParaSocorrer.value = resposta.data;
	})
	.catch((erro) => {
		alert(erro.response?.data?.msg ?? "Erro desconhecido ao recuperar resgates para a cidade " + cidade.nome + ", recarregue a página e tente novamente.");
	});
	ArmazenamentoService.insere("idCidadeAtuacao", cidade.id);
	avancarEtapa();
};

const concatenaSituacao = (vitima: DadosVitima) => {
	let situacao: string[] = [];
	if (vitima.ilhados)
		situacao.push("Ilhados");

	if (vitima.isolados)
		situacao.push("Isolados");

	if (vitima.soterrados)
		situacao.push("Soterrados");

	if (vitima.desabrigados)
		situacao.push("Desabrigados");

	return situacao.join(" | ");
};

const selecionarVitima = (vitima: DadosVitima) => {
	vitimaSelecionada.value = vitima;
	avancarEtapa();
};

const socorrerVitima = () => {
	ArmazenamentoService.insere("idVitimaSendoSocorrida", (vitimaSelecionada.value.id ?? vitimaSelecionada.value.idExterno));
	SocorristaService
	.socorrerVitima(dadosSocorrista.value, vitimaSelecionada.value)
	.then(() => {
		recuperarDadosVitima(vitimaSelecionada.value);
		avancarEtapa();
	})
	.catch((erro) => {
		alert(erro.response?.data?.msg ?? "Erro desconhecido ao iniciar socorro, recarregue a página e tente novamente.");
	});
};

const recuperarDadosVitima = (vitima: DadosVitima) => {
	VitimaService
	.recuperarDadosVitima(vitima)
	.then((resposta) => vitimaASerSocorrida.value = resposta.data)
	.catch((erro) => {
		alert(erro.response?.data?.msg ?? "Erro desconhecido ao recuperar dados da vítima a ser socorrida, recarregue a página.");
	});
};

const atualizarEstadoSocorro = (novoEstado: EstadoSocorro) => {
	SocorristaService
	.atualizarEstadoSocorro(novoEstado, vitimaASerSocorrida.value)
	.then(() => {

		cidadesComResgate.value   = [];
		vitimasParaSocorrer.value = [];
		vitimaSelecionada.value   = null;
		vitimaASerSocorrida.value = null;

		ArmazenamentoService.deleta("idCidadeAtuacao");

		if (novoEstado === EstadoSocorro.SOCORRISTA_DESISTIU)
			router.push("/");

		else if (
			novoEstado === EstadoSocorro.VITIMAS_NAO_LOCALIZADAS
			|| novoEstado === EstadoSocorro.CONCLUIDO
		)
			atualizarEtapa(3);
	})
	.catch((erro) => {
		alert(erro.response?.data?.msg ?? "Erro desconhecido ao atualizar o socorro, recarregue a página e tente novamente.");
	});
};

const atualizaDados = () => {

	recuperarEtapaAtual();

	if (cidadesComResgate.value.length === 0)
		recuperarCidadesRSComResgate();

	if (vitimaASerSocorrida.value === undefined)
		recuperarDadosVitima({
			idExterno: ArmazenamentoService.seleciona("idVitimaSendoSocorrida"),
			nome     : ""
		});

	if (vitimasParaSocorrer.value.length === 0 && ArmazenamentoService.seleciona("idCidadeAtuacao"))
		SocorristaService
		.recuperarPedidosSocorroCidade({
			id  : parseInt(ArmazenamentoService.seleciona("idCidadeAtuacao")),
			nome: ""
		})
		.then((resposta) => {
			vitimasParaSocorrer.value = resposta.data;
		})
		.catch((erro) => {
			if (etapa.value <= 4)
				alert(erro.response?.data?.msg ?? "Erro desconhecido ao recuperar resgates para a cidade, recarregue a página e tente novamente.");
		});
};

// Observadores
watch(() => route.query.etapa, atualizaDados);

// Ciclo de vida
onMounted(atualizaDados);

// "https://www.google.com/maps/@" + position.coords.latitude + "," + position.coords.longitude + ",19z?entry=ttu";
</script>

<template>

<button @click.prevent="retrocederEtapa"><<< Voltar</button>

<!-- Alerta -->
<div
	v-if="etapa === 1"
	class="col-center space-y-12"
>
	<h1 class="font-bold text-center text-5xl">Atenção !!!</h1>

	<p class="font-bold">
		Tome cuidado no resgate para não se tornar alguém que precisa ser resgatado!
	</p>

	<button
		@click.prevent="avancarEtapa"
		class="btn btn-bg"
	>
		Serei cauteloso(a)
	</button>
</div>

<!-- Coleta dos dados -->
<div v-else-if="etapa === 2">
	<form class="space-y-4" action="#" method="POST">

		<!-- Nome -->
		<div>
			<label for="nome">Seu nome:</label>
			<div class="mt-2">
				<input
					id="nome"
					v-model="dadosSocorrista.nome"
					type="text"
					autocomplete="nome"
					placeholder="Nome:"
				/>
			</div>
		</div>

		<!-- Telefone -->
		<div>
			<label for="telefone">Telefone para contato:</label>
			<div class="mt-2">
				<input
					id="telefone"
					v-model="dadosSocorrista.telefone"
					type="text"
					autocomplete="telefone"
					placeholder="Telefone / Celular:"
				/>
			</div>
		</div>

		<fieldset>
			<legend>Grupos:</legend>
			<div class="mt-2 space-y-4">
				<div class="flex items-center gap-x-3">
					<input
						id="tem-instituicao"
						v-model="dadosSocorrista.temGrupo"
						:value="true"
						name="grupo"
						type="radio"
						class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
					/>

					<label for="tem-instituicao" class="block leading-6">
						Pertenço a uma instituição de resgate
					</label>
				</div>

				<div class="flex items-center gap-x-3">
					<input
						id="sem-grupo"
						v-model="dadosSocorrista.temGrupo"
						:value="false"
						name="grupo"
						type="radio"
						class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
					/>

					<label for="sem-grupo" class="block leading-6">
						Sem grupo
					</label>
				</div>
			</div>
		</fieldset>

		<fieldset v-if="dadosSocorrista.temGrupo">
			<legend>Instituição:</legend>
			<div class="mt-2 space-y-4">
				<div
					v-for="instituicao in getTodasInstituicoesResgate()"
					:key="'instituicao-' + instituicao.id"
					class="flex items-center gap-x-3"
				>
					<input
						v-model="dadosSocorrista.instituicaoResgate"
						:value="instituicao.id"
						:id="'instituicao-' + instituicao.id"
						:name="'instituicao-' + instituicao.id"
						type="radio"
						class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
					/>

					<label
						:for="'instituicao-' + instituicao.id"
						class="block leading-6"
						v-text="instituicao.nome"
					/>
				</div>
			</div>
		</fieldset>

		<button
			type="submit"
			class="btn btn-bg"
			@click.prevent="salvarDados"
		>
			Avançar
		</button>
	</form>
</div>

<!-- Cidade -->
<div
	v-else-if="etapa === 3"
	class="col-center"
>
	<h1 class="font-bold text-center text-4xl">
		Escolha a cidade de atuação
	</h1>

	<div class="space-y-3 mt-5 w-10/12">
		<button
			@click.prevent="selecionarCidade(cidade)"
			class="btn btn-bg"
			v-for="cidade in cidadesComResgate"
			:key="'cidade-' + cidade.id"
			v-text="cidade.nome"
		/>
	</div>
</div>

<!-- Pedidos de socorro -->
<div
	v-else-if="etapa === 4"
	class="space-y-12 mb-5"
>
	<h1 class="font-bold text-center text-4xl">
		Escolha um pedido de socorro
	</h1>

	<h2 v-if="vitimasParaSocorrer.length === 0">Carregando...</h2>

	<div
		v-else
		class="space-y-5"
		v-for="vitima in vitimasParaSocorrer"
		:key="'pedido-' + vitima.id"
	>

		<hr class="mb-12"/>

		<div>
			<p class="font-bold">Local / Endereço:</p>
			<p v-text="vitima.localEndereco"/>
		</div>

		<div>
			<p class="font-bold">Quantidade de pessoas:</p>
			<p>
				{{ vitima.qntPessoas }} pessoa{{ vitima.qntPessoas > 1 ? "s" : "" }}
			</p>
		</div>

		<div>
			<p class="font-bold">Quantidade de animais:</p>
			<p>
				{{ vitima.qntAnimais }} anima{{ vitima.qntAnimais > 1 ? "is" : "l" }}
			</p>
		</div>

		<div>
			<p class="font-bold">Situação:</p>
			<p v-text="concatenaSituacao(vitima)"/>
		</div>

		<button
			class="btn btn-bg"
			@click.prevent="selecionarVitima(vitima)"
		>
			Socorrer
		</button>
	</div>
</div>

<!-- Confirmação de ida ao resgate -->
<div
	v-if="etapa === 5"
	class="col-center space-y-12"
>
	<h1 class="font-bold text-center text-5xl">Atenção !!!</h1>

	<p class="font-bold">
		Após você confirmar este pedido de socorro,
		<strong class="text-orange-400">ele não aparecerá para mais ninguém</strong>,
		você tem certeza que irá ao resgate?
	</p>

	<div class="w-10/12 space-y-5">
		<button
			class="btn btn-bg"
			@click.prevent="socorrerVitima"
		>
			Eu irei ao resgate
		</button>

		<RouterLink
			to="/"
			class="btn"
		>
			Não irei ao resgate
		</RouterLink>
	</div>
</div>

<!-- Dados pedido -->
<div
	v-else-if="etapa === 6 && vitimaASerSocorrida"
	class="space-y-5 mb-5"
>
	<h1 class="font-bold text-center text-4xl">
		Todos dados do SOS
	</h1>

	<div class="space-y-7">
		<hr/>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>{{ vitimaASerSocorrida.nome }}</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p class="space-x-4">
				<span>{{ Formatacoes.numeroTelefone(vitimaASerSocorrida.telefone) }}</span>
				<a :href="'tel:' + vitimaASerSocorrida.telefone" target="_blank">Ligar</a>
				<a :href="'https://wa.me/' + vitimaASerSocorrida.telefone + '?text=Estou%20indo%20te%20socorrer%21'"
				   target="_blank">WhatsApp</a>
			</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>{{ vitimaASerSocorrida.localEndereco }}</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>{{ vitimaASerSocorrida.cidade?.nome }}</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>{{ vitimaASerSocorrida.qntPessoas }} pessoa{{ vitimaASerSocorrida.qntPessoas > 1 ? "s" : "" }}</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>{{ vitimaASerSocorrida.qntAnimais }} anima{{ vitimaASerSocorrida.qntAnimais > 1 ? "is" : "l" }}</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>{{ concatenaSituacao(vitimaASerSocorrida) }}</p>
		</div>

		<div class="space-y-5">
			<button
				class="btn"
				@click.prevent="atualizarEstadoSocorro(EstadoSocorro.SOCORRISTA_DESISTIU)"
			>
				Não poderemos ir ao resgate
			</button>

			<button
				class="btn"
				@click.prevent="atualizarEstadoSocorro(EstadoSocorro.VITIMAS_NAO_LOCALIZADAS)"
			>
				Não localizados
			</button>

			<button
				class="btn btn-bg"
				@click.prevent="atualizarEstadoSocorro(EstadoSocorro.CONCLUIDO)"
			>
				Resgate concluído
			</button>
		</div>
	</div>

	<ModalConfirmacao/>
</div>
</template>

<style scoped lang="scss">

</style>