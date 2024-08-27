<template>
	<div class="main-layout">
		<Header />
		<main class="content">
			<slot></slot>
		</main>
	</div>
</template>

<script setup lang="ts">
import Header from "./Header.vue";
</script>

<style scoped>
.main-layout {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.content {
	flex: 1;
	overflow-y: auto;
}
</style>
