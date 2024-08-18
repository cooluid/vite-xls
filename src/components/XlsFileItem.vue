<script lang="ts" setup>
interface Props {
	index: number;
	name: string;
}

const props = defineProps<Props>();

</script>

<template>
	<div>
		{{ props.index }}. {{ props.name }}
	</div>
</template>

<style scoped>

</style>