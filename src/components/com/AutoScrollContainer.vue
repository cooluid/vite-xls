<template>
    <div class="auto-scroll-container" ref="container">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";

const props = defineProps<{
    watchSource: any;
}>();

const container = ref<HTMLElement | null>(null);
let isScrollToBottom = true;

const scrollToBottom = () => {
    if (!container.value) return;

    nextTick(() => {
        container.value?.scrollTo({
            top: container.value.scrollHeight,
            behavior: "smooth",
        });
    });
};

const handleScroll = () => {
    if (!container.value) return;
    const { scrollTop, clientHeight, scrollHeight } = container.value;
    isScrollToBottom = scrollTop + clientHeight >= scrollHeight * 0.9;
};

onMounted(() => {
    container?.value?.addEventListener("scroll", handleScroll, { passive: true });
    scrollToBottom();
});

onUnmounted(() => {
    container?.value?.removeEventListener("scroll", handleScroll);
});

watch(() => props.watchSource, scrollToBottom, { deep: true });
</script>
<style scoped>
.auto-scroll-container {
    height: 100%;
    overflow-y: auto;
}
</style>