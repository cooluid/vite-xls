<script lang="ts" setup>
import {ref, watch} from "vue";

const props = defineProps({
	modelValue: Boolean,
	labelName: {
		type: String,
		default: ""
	}
});

const isSelected = ref(props.modelValue);
const emit = defineEmits(["update:modelValue"]);

watch(isSelected, (newVal => {
	console.log("isSelected", newVal);
	emit("update:modelValue", newVal);
}));


</script>

<template>
	<div>
		<div :class="{selected: isSelected}" class="list-item" @click="isSelected = !isSelected">
			<el-checkbox v-model="isSelected" :label="labelName" @click.stop>
				<slot></slot>
			</el-checkbox>

		</div>

	</div>
</template>

<style scoped>
.list-item {
	width: 98%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 16px;
	text-align: left;
	border-bottom: 1px solid #ccc;
	color: #333;
	transition: background-color 0.2s ease;
	cursor: pointer;
	box-sizing: border-box;
}

.list-item:hover {
	background-color: #f5f5f5;
}

.list-item.selected {
	background-color: #c6e2ff;
}

</style>