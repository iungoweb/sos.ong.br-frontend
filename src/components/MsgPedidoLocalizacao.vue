<script setup>
import { defineProps } from 'vue'

// Props
defineProps({
	qntVezesPermissaoLocalizacaoNegada: {
		type: Number,
		required: true,
	}
});
</script>

<template>
<h1
	class="text-4xl font-bold leading-tight"
	:class="{'text-red-600': qntVezesPermissaoLocalizacaoNegada >= 1}"
>
	{{
		qntVezesPermissaoLocalizacaoNegada >= 1
			? 'Atenção!!! A Localização fornecerá ao resgate as suas coordenadas !'
			: 'Permita o acesso a localização para sabermos onde você está.'
	}}
</h1>
</template>

<style scoped lang="scss">

</style>