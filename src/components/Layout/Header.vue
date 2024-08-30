<template>
	<header class="m-title">
		<h2>表格转换工具</h2>
		<svg @click="close" class="icon-close" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
			viewBox="0 0 48 48">
			<g fill="none" stroke-linejoin="round" stroke-width="4">
				<path fill="#2f88ff" stroke="white"
					d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" />
				<path stroke="#fff" stroke-linecap="round" d="M29.6567 18.3432L18.343 29.6569" />
				<path stroke="#fff" stroke-linecap="round" d="M18.3433 18.3432L29.657 29.6569" />
			</g>
		</svg>
	</header>
</template>

<script setup lang="ts">

const close = () => {
	window.electronAPI.invoke("close-app");
};
</script>
<style scoped>
.m-title {
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	background-color: #337ecc;
}

.icon-close {
	position: absolute;
	right: 20px;
	top: 10px;
	cursor: pointer;
	transition: color 0.3s ease-in-out;
	font-size: 20px;
}
</style>
