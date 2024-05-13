<script setup lang="ts">
import { ref } from "vue";

// Dados
const emProducao = ref(import.meta.env.PROD)
</script>

<template>

<div class="col-center">

	<h1 v-if="emProducao" class="text-3xl font-bold mb-10">Em desenvolvimento!</h1>

	<h1 v-if="!emProducao" class="text-3xl font-bold mb-10">Você quer...</h1>

	<div v-if="!emProducao" class="max-w-max">
		<RouterLink
			to="/me-ajude"
			class="btn btn-bg mb-7"
		>
			...socorro
		</RouterLink>

		<RouterLink
			to="/socorrer"
			class="btn"
		>
			...resgatar
		</RouterLink>
	</div>
</div>

</template>

<style scoped lang="scss">

</style>