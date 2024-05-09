<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";

// Props
const props = defineProps({
	modelValue: {
		type   : Boolean,
		default: false
	},
	label     : {
		type   : [String, Number],
		default: ""
	}
});

// Dados
const valor = ref<boolean>(props.modelValue);

// Observadores
watch(valor, (novoValor: boolean) => emit("update:modelValue", novoValor));

// Gatilhos
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
<label class="inline-flex items-center cursor-pointer">
	<input
		type="checkbox"
		v-model="valor"
		class="sr-only peer"
	>

	<div
		class="relative w-11 h-6 bg-orange-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-400"
	/>

	<span class="ms-3 text-xl font-medium text-white">
		{{ label }}
	</span>
</label>
</template>

<style scoped lang="scss">

</style>