<script setup>
import {defineProps} from 'vue';

// Props
defineProps({
	texto: {
		type: String,
		required: true,
	}
});
</script>

<template>
<h1
	class="text-4xl font-bold"
	v-text="texto"
/>
</template>

<style scoped lang="scss">

</style>