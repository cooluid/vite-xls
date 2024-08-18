<script lang="ts" setup>
defineProps({
	name: String,
	index: Number
});

</script>

<template>
	<div>
		{{ index }}. {{ name }}
	</div>
</template>

<style scoped>

</style>