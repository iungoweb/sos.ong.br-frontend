<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import MsgPedidoLocalizacao from "../components/MsgPedidoLocalizacao.vue";
import TituloPagina from "../components/TituloPagina.vue";
import CheckBox from "../components/formulario/Switch.vue";
import { useRoute, useRouter } from "vue-router";
import GSPService, { DadosGPS } from "../services/GPSService";
import LocalizacaoService from "../services/VitimaService";
import vitimaService from "../services/VitimaService";
import Cidade from "../interfaces/cidade";
import ArmazenamentoService from "../services/ArmazenamentoService";
import { Formatacoes } from "../utils/formatacoes";
import { DadosPadroesVitima, DadosVitima } from "../interfaces/dadosVitima";
import SocorristaService from "../services/SocorristaService";
import { EstadoSocorro } from "../enums/EstadoSocorro";

// Globais
const route  = useRoute(),
	  router = useRouter();

// Dados
const qntVezesPermissaoLocalizacaoNegada = ref(0),
	  inicioSolicitacaoAcessoLocalizacao = ref(null),
	  etapa                              = ref(1),
	  melhorLocalizacao                  = ref<DadosGPS>(null),
	  dadosVitima                        = ref<DadosVitima>({
		  ...DadosPadroesVitima // Para clonar o objeto
	  }),
	  cidades                            = ref<Cidade[]>([]),
	  recuperandoDadosGPS                = ref(false);

// Métodos
const recuperarCidadesRS = () => {
	vitimaService
	.recuperarCidadesPorUF("RS")
	.then((resposta) => cidades.value = resposta.data);
};

const recuperarEtapaAtual = () => {

	if (route.query.etapa === undefined || route.query.etapa.length === 0) {

		if (ArmazenamentoService.seleciona("pedidoSocorroEtapa"))
			etapa.value = parseInt(ArmazenamentoService.seleciona("pedidoSocorroEtapa"));

	} else {

		etapa.value = typeof route.query.etapa == "object"
					  ? parseInt(route.query.etapa[0])
					  : parseInt(route.query.etapa);

	}

	if (etapa.value <= 0)
		etapa.value = 1;

	if (etapa.value == 2 || etapa.value == 3)
		recuperarCidadesRS();
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

const processarErroGPS = (error: GeolocationPositionError): void => {
	switch (error.code) {
		case error.PERMISSION_DENIED:

			if (Date.now() - inicioSolicitacaoAcessoLocalizacao.value > 500)
				alert("Atenção se você não permitir o acesso a localização os socorristas não poderão chegar até você.");
			else
				alert("Você negou o acesso a localização, para continuar será necessário liberar o acesso manualmente no seu navegador.");

			qntVezesPermissaoLocalizacaoNegada.value++;
			return;

		case error.POSITION_UNAVAILABLE:
			alert("Informação de localização não está disponível.");
			avancarEtapa();
			return;

		case error.TIMEOUT:
			alert("Tempo limite para obter a localização expirou, confirme essa mensagem e aguarde mais uns instantes.");
			recuperarPrimeiraLocalizacao();
			return;

		default:
			alert(error.message + " #" + error.code);
			recuperarPrimeiraLocalizacao();
			return;
	}
};

const recuperarPrimeiraLocalizacao = () => {

	if (recuperandoDadosGPS.value)
		return;

	recuperandoDadosGPS.value                = true;
	inicioSolicitacaoAcessoLocalizacao.value = Date.now();

	GSPService
	.recuperarLocalizacao({
		enableHighAccuracy: false,
		maximumAge        : 3600000 // 1h
	})
	.then((coordenadas: DadosGPS) => {

		melhorLocalizacao.value = coordenadas;
		LocalizacaoService
		.salvarLocalizacao(coordenadas)
		.catch((erro) => {
			console.log(erro);
		});
		recuperaMenorLocalizacao(20);
		avancarEtapa();
	})
	.catch((erro: Error | GeolocationPositionError) => {

		if (erro instanceof GeolocationPositionError) {

			processarErroGPS(erro);
			return;

		} else if (erro === GSPService.erroNavegadorSemSuporte) {
			avancarEtapa();
		}

		alert(erro.message);
	});
};

const recuperaMenorLocalizacao = (
	precisaoMaxima: number,
	qntTentativas: number = 0
): void => {

	qntTentativas++;

	GSPService
	.recuperarLocalizacao({ maximumAge: 0 })
	.then((coordenadas: DadosGPS) => {

		if (coordenadas.precisao < melhorLocalizacao.value.precisao) {

			LocalizacaoService
			.salvarLocalizacao(coordenadas)
			.catch((erro) => {
				alert(erro.response);
			});

			melhorLocalizacao.value = coordenadas;
		}

		if (coordenadas.precisao > precisaoMaxima && qntTentativas < 60)
			recuperaMenorLocalizacao(precisaoMaxima, ++qntTentativas);
	})
	.catch((erro: Error | GeolocationPositionError) => {

		if (erro instanceof GeolocationPositionError) {
			processarErroGPS(erro);
			return;
		}

		alert(erro.message);

		if (qntTentativas < 60)
			recuperaMenorLocalizacao(precisaoMaxima, ++qntTentativas);
	});
};

const identificarQuemSeraSocorrido = (paraMim: boolean) => {
	vitimaService.salvarQuemSeraSocorrido(paraMim);
	avancarEtapa();
};

const pedirSocorro = () => {
	vitimaService
	.salvarDemaisDados(dadosVitima.value)
	.then(() => {
		avancarEtapa();
	})
	.catch((erro) => {
		alert(
			erro.response?.data?.msg
			?? "Erro desconhecido ao solicitar o resgate, solicite resgate através de outros meios"
		);
	});
};

const dispensarSocorro = () => {
	SocorristaService
	.atualizarEstadoSocorro(
		EstadoSocorro.VITIMA_NAO_PRECISA_MAIS,
		dadosVitima.value
	)
	.then(() => {
		atualizarEtapa(1);
		router.push("/");
		dadosVitima.value = { ...DadosPadroesVitima };
		cidades.value     = [];
	})
	.catch((erro) => {
		alert(
			erro.response?.data?.msg
			?? "Erro desconhecido dispensar o socorro, recarregue a página e tente novamente."
		);
	});
};

// Observadores
watch(qntVezesPermissaoLocalizacaoNegada, (novoValor: number) => {
	if (novoValor == 3)
		alert("Para continuar com o pedido de socorro será necessário permitir no seu navegador o acesso a sua localização.");
});

watch(() => route.query.etapa, () => recuperarEtapaAtual());

// Ciclo de vida
onMounted(() => recuperarEtapaAtual());

</script>

<template>

<!-- Solicitação da localização -->
<div
	v-if="etapa === 1"
	class="col-center justify-between"
>
	<MsgPedidoLocalizacao :qntVezesPermissaoLocalizacaoNegada="qntVezesPermissaoLocalizacaoNegada"/>

	<div class="w-11/12 my-5">
		<button
			class="btn btn-bg mb-4 text-black"
			@click.prevent="recuperarPrimeiraLocalizacao"
		>
			Permitir localização
		</button>
	</div>

	<MsgPedidoLocalizacao :qntVezesPermissaoLocalizacaoNegada="qntVezesPermissaoLocalizacaoNegada"/>
</div>

<!-- Para quem é a solicitação -->
<div
	v-else-if="etapa === 2"
	class="col-center"
>
	<TituloPagina
		texto="Quem precisa de socorro?"
		class="text-center mb-4"
	/>

	<button
		class="btn btn-bg mb-4"
		@click.prevent="identificarQuemSeraSocorrido(true)"
	>
		O socorro é para mim
	</button>

	<button
		class="btn mb-4"
		@click.prevent="identificarQuemSeraSocorrido(false)"
	>
		O socorro é para outra pessoa
	</button>
</div>

<!-- Coleta dos dados -->
<div v-else-if="etapa === 3">
	<form class="space-y-4" action="#" method="POST">

		<!-- Nome -->
		<div>
			<label for="nome">Nome da pessoa a ser resgatada:</label>
			<div class="mt-2">
				<input
					id="nome"
					v-model.trim="dadosVitima.nome"
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
					v-model.trim="dadosVitima.telefone"
					type="number"
					autocomplete="telefone"
					placeholder="Telefone / Celular:"
				/>
			</div>
		</div>

		<!-- Cidade -->
		<div>
			<label for="cidade">Cidade de resgate:</label>
			<div class="mt-2">
				<select
					v-model="dadosVitima.cidadeId"
					name="cidade"
					id="cidade"
				>
					<option :value="null" disabled>Informe a cidade para o resgate</option>

					<option
						v-for="c in cidades"
						:key="'cidade-' + c.id"
						:value="c.id"
						v-text="c.nome"
					/>
				</select>
			</div>
		</div>

		<!-- Local -->
		<div>
			<label for="endereco">Local / Endereço de resgate:</label>
			<div class="mt-2">
				<input
					id="endereco"
					v-model.trim="dadosVitima.localEndereco"
					type="text"
					autocomplete="endereco"
					placeholder="Local / Endereço de resgate:"
				/>
			</div>
		</div>

		<!-- Quantidade de pessoas -->
		<div>
			<label for="qnt-pessoas">Quantidade de pessoas:</label>
			<div class="mt-2">
				<input
					id="qnt-pessoas"
					v-model.trim="dadosVitima.qntPessoas"
					type="number"
					autocomplete="qnt-pessoas"
					placeholder="Quantidade de pessoas:"
				/>
			</div>
		</div>

		<!-- Quantidade de animais -->
		<div>
			<label for="qnt-animais">Quantidade de animais:</label>
			<div class="mt-2">
				<input
					id="qnt-animais"
					v-model.trim="dadosVitima.qntAnimais"
					type="number"
					autocomplete="qnt-animais"
					placeholder="Quantidade de animais:"
				/>
			</div>
		</div>

		<CheckBox
			label="Ilhados / Cercado por água"
			v-model="dadosVitima.ilhados"
		/>
		<CheckBox
			label="Isolados / Sem acesso por ruas e vias"
			v-model="dadosVitima.isolados"
		/>
		<CheckBox
			label="Soterrados por deslizamento de terra"
			v-model="dadosVitima.soterrados"
		/>
		<CheckBox
			label="Desabrigados"
			v-model="dadosVitima.desabrigados"
		/>

		<button
			type="submit"
			class="btn btn-bg"
			@click.prevent="pedirSocorro"
		>
			Enviar pedido de socorro !!!
		</button>
	</form>
</div>

<!-- Solicitação recebida -->
<div
	v-else-if="etapa === 4"
	class="col-center"
>
	<h1 class="text-4xl font-bold text-center">Solicitação de socorro recebida!</h1>

	<button
		class="btn btn-bg mt-7 text-xl"
		@click.prevent="dispensarSocorro"
	>
		Não preciso mais de socorro
	</button>

	<hr class="my-7 w-4/5"/>

	<p class="font-bold text-center text-xl">
		Atenção no telefone informado na tela anterior, socorristas poderão entrar em contato!
		<br/> <span class="text-orange-500">{{ Formatacoes.numeroTelefone(dadosVitima.telefone) }}</span>
	</p>

	<!--	<hr class="my-7 w-4/5"/>-->

	<!--	<p class="font-bold text-center w-3/4 text-xl">-->
	<!--		Forneça fotos do local onde você está para facilitar o resgate-->
	<!--	</p>-->

	<!--	<button class="btn text-xl mt-7">-->
	<!--		Adicionar fotos-->
	<!--	</button>-->
</div>
</template>

<style scoped lang="scss">
label {
	@apply cursor-pointer;
}
</style>