<script setup lang="ts">
import { ref, watch } from "vue";
import MsgPedidoLocalizacao from "../components/MsgPedidoLocalizacao.vue";
import TituloPagina from "../components/TituloPagina.vue";
import CheckBox from "../components/formulario/CheckBox.vue";

// Dados
const configuracaoRecuperarLocalizacao   = ref({
		  enableHighAccuracy: true, // Ativa alta precisão
		  timeout           : 9500, // Tempo limite para a obtenção da localização (em milissegundos)
		  maximumAge        : 60000 // Tempo máximo em que uma localização anterior pode ser usada (em milissegundos)
	  }),
	  qntVezesPermissaoLocalizacaoNegada = ref(0),
	  etapa                              = ref(4);

const recuperarLocalizacao = () => {
	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(
			showPosition,
			aoOcorrerErro,
			configuracaoRecuperarLocalizacao.value
		);

	} else {
		alert("Geolocalização não é suportada pelo seu navegador.");
	}
};

function showPosition(position) {
	etapa.value++;
	// if (ultimoPrecisao.value !== null && position.coords.accuracy >= ultimoPrecisao.value)
	// 	return;
	//
	// ultimoPrecisao.value = position.coords.accuracy;
	// link.value  = "https://www.google.com/maps/@" + position.coords.latitude + "," + position.coords.longitude + ",19z?entry=ttu";
}

function aoOcorrerErro(error): void {

	switch (error.code) {
		case error.PERMISSION_DENIED:
			qntVezesPermissaoLocalizacaoNegada.value++;
			return;

		case error.POSITION_UNAVAILABLE:
			alert("Informação de localização não está disponível.");
			return;

		case error.TIMEOUT:
			alert("Tempo limite para obter a localização expirou.");
			return;

		case error.UNKNOWN_ERROR:
			alert("Ocorreu um erro desconhecido.");
			return;

		default:
			alert(error.message + " #" + error.code);
	}
}

watch(qntVezesPermissaoLocalizacaoNegada, (novoValor: number) => {
	if (novoValor >= 3)
		etapa.value++;
});
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
			@click.prevent="recuperarLocalizacao"
		>
			Permitir localização
		</button>

		<button class="btn">Continuar sem localização</button>
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
		@click.prevent="etapa++"
	>
		O socorro é para mim
	</button>

	<button
		class="btn mb-4"
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
					type="text"
					autocomplete="telefone"
					placeholder="Telefone / Celular:"
				/>
			</div>
		</div>

		<!-- Cidade -->
		<div>
			<label for="cidade">Cidade de resgate:</label>
			<div class="mt-2">
				<input
					id="cidade"
					type="text"
					autocomplete="cidade"
					placeholder="Cidade de resgate:"
				/>
			</div>
		</div>

		<!-- Local -->
		<div>
			<label for="endereco">Local / Endereço de resgate:</label>
			<div class="mt-2">
				<input
					id="endereco"
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
					type="number"
					autocomplete="qnt-animais"
					placeholder="Quantidade de animais:"
				/>
			</div>
		</div>

		<CheckBox label="Ilhados / Cercado por água"/>
		<CheckBox label="Isolados / Sem acesso por ruas e vias"/>
		<CheckBox label="Soterrados por deslizamento de terra"/>
		<CheckBox label="Desabrigados"/>

		<button
			type="submit"
			class="btn btn-bg"
			@click.prevent
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

	<button class="btn btn-bg mt-7 text-xl">
		Não preciso mais de socorro
	</button>

	<hr class="my-7 w-4/5"/>

	<p class="font-bold text-center text-xl">
		Atenção no telefone informado na tela anterior, regatistas poderão entrar em contato!
		<br/> 00 00000 0000
	</p>

	<hr class="my-7 w-4/5"/>

	<p class="font-bold text-center w-3/4 text-xl">
		Forneça fotos do local onde você está para facilitar o resgate
	</p>

	<button class="btn text-xl mt-7">
		Adicionar fotos
	</button>
</div>
</template>

<style scoped lang="scss">

</style>