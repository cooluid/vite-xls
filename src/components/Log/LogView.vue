<template>
	<AutoScrollContainer :watchSource="logList">
		<LogItem v-for="(item, index) in logList" :key="index" :item="item" />
	</AutoScrollContainer>
	<IconItem icon="#icon-clear" @click="clearLog" />
</template>
<script setup lang="ts">
import { LogEntry } from "@/stores/logStore";
import { computed } from "vue";
import LogItem from "./LogItem.vue";
import AutoScrollContainer from "@/components/com/AutoScrollContainer.vue";
import { useLogStore } from "@/stores/logStore";
import IconItem from "@/components/com/IconItem.vue";
const props = defineProps<{
	list: LogEntry[];
}>();

const logList = computed(() => props.list);
const store = useLogStore();

const clearLog = () => {
	store.clear();
};

</script>
<style scoped>
.icon-item {
	position: absolute;
	right: 10px;
	bottom:10px;
}
</style>