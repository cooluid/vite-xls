<template>
	<div class="log-view" ref="logContainer">
		<LogItem v-for="(item, index) in logList" :key="index" :item="item" />
	</div>
</template>
<script setup lang="ts">
import { LogEntry } from "@/stores/logStore";
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import LogItem from "./LogItem.vue";

const props = defineProps<{
	list: LogEntry[];
}>();

const logList = computed(() => props.list);
const logContainer = ref<HTMLDivElement | null>(null);
let observer: MutationObserver | null = null;
let isScrolledToBottom = true;

const handleScroll = () => {
	nextTick(() => {
		if (logContainer.value && isScrolledToBottom) {
			logContainer.value.scrollTo({
				top: logContainer.value.scrollHeight,
				behavior: 'smooth'
			});
		}
	});
};

const checkScrollPosition = () => {
	if (logContainer.value) {
		const { scrollTop, scrollHeight, clientHeight } = logContainer.value;
		isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 5;
	}
};

watch(logList, () => {
	handleScroll();
}, { deep: true });

onMounted(() => {
	if (logContainer.value) {
		logContainer.value.addEventListener('scroll', checkScrollPosition);
	}
	handleScroll();
});

onUnmounted(() => {
	if (logContainer.value) {
		logContainer.value.removeEventListener('scroll', checkScrollPosition);
	}
});

</script>
<style scoped>
.log-view {
	height: 100%;
	overflow-y: auto;
}
</style>