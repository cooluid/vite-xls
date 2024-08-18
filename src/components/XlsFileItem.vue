<script lang="ts" setup>
interface Props {
	index: 0;
	name: string;
}

defineProps({
	id: Number,
	ext: {
		type: Object,
		required: true,
		default: {"num": 1},
	}
})

defineProps({
	type: [String]
});

const props = defineProps<Props>();

</script>

<template>
	<div>
		{{ props.index }}. {{ props.name }}
	</div>
</template>

<style scoped>

</style>