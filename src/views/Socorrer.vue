<script setup>
import {ref} from "vue";
import CheckBox from "../components/formulario/CheckBox.vue";
import ModalConfirmacao from "../components/modal/ModalConfirmacao.vue";

// Dados
const etapa = ref(1);

</script>

<template>
<!-- Alerta -->
<div
	v-if="etapa === 1"
	class="col-center space-y-12"
>
	<h1 class="font-bold text-center text-5xl">Atenção !!!</h1>

	<p class="font-bold">
		Tome cuidado no resgate para não se tornar alguém que precisa ser resgatado!
	</p>

	<button class="btn btn-bg">
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

		<fieldset>
			<legend>Grupos:</legend>
			<div class="mt-2 space-y-4">
				<div class="flex items-center gap-x-3">
					<input id="tem-instituicao" name="grupo" type="radio"
						   class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"/>
					<label for="tem-instituicao" class="block leading-6">
						Pertenço a uma instituição de resgate
					</label>
				</div>

				<div class="flex items-center gap-x-3">
					<input id="sem-grupo" name="grupo" type="radio"
						   class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
					<label for="sem-grupo" class="block leading-6">
						Sem grupo
					</label>
				</div>
			</div>
		</fieldset>

		<fieldset>
			<legend>Instituição:</legend>
			<div class="mt-2 space-y-4">
				<div class="flex items-center gap-x-3">
					<input
						id="bombeiros"
						name="instituicao"
						type="radio"
						class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
					/>
					<label for="bombeiros" class="block leading-6">
						Bombeiros
					</label>
				</div>

				<div class="flex items-center gap-x-3">
					<input
						id="defesa-civil"
						name="instituicao"
						type="radio"
						class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
					/>
					<label for="defesa-civil" class="block leading-6">
						Defesa civil
					</label>
				</div>

				<div class="flex items-center gap-x-3">
					<input
						id="policia"
						name="instituicao"
						type="radio"
						class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
					/>
					<label for="policia" class="block leading-6">
						Polícia
					</label>
				</div>

				<div class="flex items-center gap-x-3">
					<input
						id="forca-militar-nacional"
						name="instituicao"
						type="radio"
						class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
					/>
					<label for="forca-militar-nacional" class="block leading-6">
						Exército / Marinha / Aeronáutica
					</label>
				</div>

				<div class="flex items-center gap-x-3">
					<input
						id="forca-militar-nacional"
						name="instituicao"
						type="radio"
						class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
					/>
					<label for="forca-militar-nacional" class="block leading-6">
						Cruz vermelha
					</label>
				</div>

				<div class="flex items-center gap-x-3">
					<input
						id="forca-militar-nacional"
						name="instituicao"
						type="radio"
						class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
					/>
					<label for="forca-militar-nacional" class="block leading-6">
						Outra governamental
					</label>
				</div>

				<div class="flex items-center gap-x-3">
					<input
						id="forca-militar-nacional"
						name="instituicao"
						type="radio"
						class="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
					/>
					<label for="forca-militar-nacional" class="block leading-6">
						Outras
					</label>
				</div>
			</div>
		</fieldset>

		<button
			type="submit"
			class="btn btn-bg"
			@click.prevent
		>
			Avançar >>>
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
			class="btn btn-bg"
			v-for="(cidade, i) in [1,2,3,4,5,6,7]"
			:key="'cidade-' + i"
		>
			Cidade {{ cidade }}
		</button>
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

	<div
		class="space-y-5"
		v-for="i in [1,2,3,4,5,6,7]"
		:key="'pedido-' + i"
	>

		<hr class="mb-12"/>

		<div>
			<p class="font-bold">Local / Endereço:</p>
			<p>Rua XYZ, nº 000, Perto do mercado</p>
		</div>

		<div>
			<p class="font-bold">Quantidade de pessoas:</p>
			<p>3 pessoas</p>
		</div>

		<div>
			<p class="font-bold">Quantidade de animais:</p>
			<p>1 animal</p>
		</div>

		<div>
			<p class="font-bold">Situação:</p>
			<p>Ilhados | Desabrigados</p>
		</div>

		<button
			class="btn btn-bg"
		>
			Resgatar
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
		<button class="btn btn-bg">
			Eu irei ao resgate
		</button>

		<button class="btn">
			Não irei ao resgate
		</button>
	</div>
</div>

<!-- Dados pedido -->
<div
	v-else-if="etapa === 6"
	class="space-y-5 mb-5"
>
	<h1 class="font-bold text-center text-4xl">
		Todos dados do SOS
	</h1>

	<div
		class="space-y-7"
	>
		<hr />

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>Seu João / Dona Maria </p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p class="space-x-4">
				<span>00 00000 0000</span>
				<a href="tel:00000000000" target="_blank">Ligar</a>
				<a href="https://wa.me/00000000000?text=Estou%20indo%20te%20socorrer%21" target="_blank">WhatsApp</a>
			</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>Rua XYZ, nº 000, Perto do mercado</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>Cidade 1</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>3 pessoas</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<p>1 animal</p>
		</div>

		<div class="py-1 border-l-2 border-amber-600 pl-4">
			<ul class="list-disc pl-5">
				<li>Ilhados / Cercados por água</li>
				<li>Desabrigados</li>
			</ul>
		</div>

		<div class="space-y-5">
			<button class="btn">
				Não poderemos ir ao resgate
			</button>

			<button class="btn">
				Não localizados
			</button>

			<button class="btn btn-bg">
				Resgate concluído
			</button>
		</div>
	</div>

	<ModalConfirmacao />
</div>
</template>

<style scoped lang="scss">

</style>