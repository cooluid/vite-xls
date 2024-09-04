<template>
    <div class="log-item">
        <div :class="[`log-item-header-${logItem.type}`, 'log-item-info']">
            <span>{{ logItem.time }}：</span>
            <span :class="{ 'message-success': logItem.type === 'success' }" @click="handleClick">{{
                logItem.message }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { LogEntry } from "@/stores/logStore";
import { computed } from "vue";
const props = defineProps<{
    item: LogEntry
}>();

const logItem = computed(() => props.item);

const handleClick = () => {
    if (logItem.value.type === 'success') {
        window.electronAPI.invoke('show-item-in-folder', logItem.value.path);
    }
}
</script>
<style scoped>
.log-item-header-success {
    color: forestgreen;
}

.message-success {
    text-decoration: underline;
    cursor: pointer;
}

.log-item-header-warning {
    color: #dac106;
}

.log-item-header-error {
    color: #f40808;
}

.log-item-header-info {
    color: var(--el-text-color-primary);
}

.log-item-info:hover {
    background-color: #dce3af;
}

.log-item-info {
    transition: background-color 0.2s ease;
    text-align: left;
    font-size: 12px;
}
</style>