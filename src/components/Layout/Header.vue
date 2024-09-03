<template>
	<div class="m-icons">
		<IconItem :icon="themeIcon" @click="changeTheme" />
	</div>
</template>

<script setup lang="ts">
import IconItem from '../com/IconItem.vue'
import { useDark, useToggle } from '@vueuse/core';
import { computed } from 'vue';
const isDark = useDark()
const toggleDark = useToggle(isDark)

const themeIcon = computed(() => isDark.value ? '#icon-a-zu4' : '#icon-anhei')

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
