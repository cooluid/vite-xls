<template>
	<AutoScrollContainer :watchSource="logList">
		<LogItem v-for="(item, index) in logList" :key="index" :item="item" />
	</AutoScrollContainer>
</template>
<script setup lang="ts">
import { LogEntry } from "@/stores/logStore";
import { computed } from "vue";
import LogItem from "./LogItem.vue";
import AutoScrollContainer from "@/components/com/AutoScrollContainer.vue";

const props = defineProps<{
	list: LogEntry[];
}>();

const logList = computed(() => props.list);

</script>
<style scoped></style>