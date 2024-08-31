<template>
	<div class="m-icons">
		<IconItem icon="#icon-theme" @click="changeTheme" />
	</div>
</template>

<script setup lang="ts">
import IconItem from '../com/IconItem.vue'
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark()
const toggleDark = useToggle(isDark)

const changeTheme = () => {
	toggleDark()
}
</script>

<style scoped>
.m-icons {
	padding: 5px 20px 0 0;
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	background-color: var(--el-bg-color);
}
</style>
