<template>
    <svg class="icon icon-item" aria-hidden="true" :width="size" :height="size">
        <use :xlink:href="icon"></use>
    </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
    icon: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: '24'
    }
});
</script>

<style scoped>
.icon-item {
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
}
</style>