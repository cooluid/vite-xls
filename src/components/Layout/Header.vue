<template>
	<div class="m-icons">
		<IconItem icon="#icon-theme" />
		<IconItem icon="#icon-mendianshezhi" />
	</div>
</template>

<script setup lang="ts">
import IconItem from '../com/IconItem.vue'
</script>

<style scoped>
.m-icons {
	padding:5px;
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}
</style>
