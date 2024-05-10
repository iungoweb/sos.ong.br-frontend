<script setup lang="ts">

</script>

<template>

<div class="col-center">

	<h1 class="text-3xl font-bold mb-10">Em desenvolvimento!</h1>

	<h1 v-if="false" class="text-3xl font-bold mb-10">Você quer...</h1>

	<div v-if="false" class="max-w-max">
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