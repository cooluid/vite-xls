<template>
    <div class="log-item">
        <div :class="['log-item-header', `log-item-header-${logItem.type}`, 'log-item-info']">
            <span>{{ logItem.time }}：</span>
            <span>{{ logItem.mssage }}</span>
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
</script>
<style scoped>
.log-item-header-success {
    color: forestgreen;
}

.log-item-header-warning {
    color: #dac106;
}

.log-item-header-error {
    color: #f40808;
}

.log-item-header:hover {
    background-color: #dce3af;
}

.log-item-info {
    transition: background-color 0.2s ease;
    text-align: left;
    font-size: 12px;
}
</style>