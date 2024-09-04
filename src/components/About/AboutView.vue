<template>
    <div class="about-view">
        <el-dialog v-model="showView" width="80%">
            <template #header>
                <div class="dialog-title">
                    <span class="title">{{ config?.title || '' }}</span>
                    <span class="version">版本 {{ version || '' }}</span>
                </div>
            </template>
            <div class="blurb">
                {{ config?.blurb || '' }}
            </div>
            <div class="description-title">
                主要特点
            </div>
            <div class="description-content">
                <ul class="features-list">
                    <li v-for="feature in config?.features" :key="feature">
                        {{ feature }}
                    </li>
                </ul>
            </div>

            <div class="author">
                <div class="author-title">
                    {{ config?.author || '' }}
                </div>
                <div class="author-email">
                    {{ config?.email || '' }}
                </div>

            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { useXlsxStore } from '@/stores/xlsxStore';
import { computed, ref, onMounted } from 'vue';

interface AppConf {
    title: string;
    blurb: string;
    features: string[];
    author: string;
    email: string;
}

const props = defineProps<{
    modelValue: boolean
}>()

const store = useXlsxStore();
const version = ref("");
const config = ref<AppConf | null>(null);

onMounted(async () => {
    version.value = await window.electronAPI.invoke('get-app-version');
    const filePath = store.exportPath + '/AppConf.json';

    try {
        const loadedConfigString = await window.electronAPI.invoke('read-file', filePath);
        config.value = JSON.parse(loadedConfigString) as AppConf;

    } catch (error) {
        console.error('Error parsing JSON:', error);
        config.value = null;
    }
})

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
}>()

const showView = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value)
})
</script>

<style scoped>
.about-view {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.dialog-title .title {
    display: flex;
    flex-direction: column;
    color: var(--el-text-color-primary);
    font-size: 20px;
    font-weight: bold;
}

.dialog-title .version {
    font-size: 12px;
    color: var(--el-text-color-secondary);
}

.blurb {
    padding-top: 20px;
    padding-bottom: 10px;
    font-size: 14px;
    color: var(--el-text-color-regular);
}

.description-title {
    padding-top: 15px;
    padding-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: var(--el-text-color-primary);
}

.description-content {
    background-color: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
}

.author {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
}

.features-list {
    margin: 0;
    padding-left: 20px;
}

.features-list li {
    margin: 5px;
    color: var(--el-text-color-secondary);
}

.about-view :deep(.el-dialog) {
    background-color: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-lighter);
}
</style>