<template>
	<div class="container">
		<div class="m-title">
			<div>表格转换工具</div>
		</div>
		<el-row>
			<el-col :span="12" class="left-col">
				<div class="left-path-container" @click="btnClickImport">
					<div class="m-path-select1">
						<el-input
								v-model="xlsPath"
								placeholder="请选择表格路径" readonly>
						</el-input>
					</div>

					<div class="m-button">
						<el-button type="primary">选择</el-button>
					</div>
				</div>

				<div class="m-list">
					<XlsFileItem v-for="(item, index) in xlsFileItemList"
					             :key="index"
					             v-model="xlsFileItemList[index]">

						<div>{{ item.name }}</div>

					</XlsFileItem>
				</div>
			</el-col>

			<el-col :span="12" class="right-col">
				<el-card class="card-container">
					<div slot="header">导出设置</div>
					<div class="m-path-select2">
						<el-input ref="inputBox" placeholder="导出路径" style="width: 80%"></el-input>
						<el-button type="primary">选择</el-button>
					</div>

					<div class="set-info">
						<div class="m-switch">
							<el-switch active-text="导出JSON" class="m-switch-item"></el-switch>
							<el-switch active-text="导出AMF" class="m-switch-item"></el-switch>
						</div>
						<div class="grp-button">
							<el-tooltip content="仅导出选中的表格" effect="light" placement="top">
								<el-button class="summit-button" type="primary" @click="btnExport(0)">导出选中</el-button>
							</el-tooltip>
							<el-tooltip content="导出路径下的所有表格" effect="light" placement="top">
								<el-button class="summit-button" type="warning" @click="btnExport(1)">导出全部</el-button>
							</el-tooltip>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts">
import {useXlsxOptionsStore, XlsItem} from "../stores/XlsxOptionsStore.ts";
import {ref} from "vue";
import XlsFileItem from "./XlsFileItem.vue";
import {xlsRead} from "../utils/XlsxUtil.ts";
import {ElInput, ElNotification} from "element-plus";
import anime from 'animejs'

const store = useXlsxOptionsStore();
let xlsPath = ref(store.getXlsPath());
let xlsFileItemList = ref([] as XlsItem[]);

if (xlsPath.value) {
	store.getXlsxList().then((list) => {
		xlsFileItemList.value = list;
	});
}

const btnClickImport = async () => {
	xlsPath.value = await store.setXlsPath();
	xlsFileItemList.value = await store.getXlsxList();
}

const inputBox = ref(null);

const btnExport = async (type: number) => {
	if (!store.exportPath) {
		ElNotification({
			title: '导出路径未设置',
			message: '请先设置导出路径',
			type: 'error'
		});

		inputBox.value && anime({
			targets: (inputBox.value as any).$el,
			translateX: [
				{value: -10, duration: 50},
				{value: 10, duration: 50},
				{value: -10, duration: 50},
				{value: 10, duration: 50},
				{value: 0, duration: 50},
			],
			easing: 'easeInOutQuad',
		});
		return;
	}
//获取选中的
	try {
		let map = await xlsRead(type);
		console.log(`map`, map);

	} catch (e) {
		console.error(e);
	}
}
</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
}

.el-row {
	width: 100%;
	height: 100%;
}

.left-col {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	height: calc(100% - 50px);
	background-color: #eeeff3;
}

.m-title {
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: black;
	background-color: #337ecc;
}

.left-path-container {
	width: 100%;
	padding-top: 5px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.right-col {
	display: flex;
	flex-direction: row;
	align-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.card-container {
	width: 90%;
	margin: 0 auto;
}

.m-list {
	width: 100%;
	flex-grow: 1;
	overflow-y: auto;
	margin-left: 5px;
}

.m-switch {
	display: flex;
	padding-top: 5px;
}

.m-switch-item {
	margin: 10px 10px 20px 10px;
}

.summit-button {
	width: 150px;
}

.set-info {
	margin-top: auto;
}

.m-path-select1 {
	width: 90%;
	padding: 5px 10px;
}

.m-button {
	padding: 5px 10px;
}

.m-path-select2 {
	padding-top: 5px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.grp-button {
	display: flex;
	justify-content: space-between;
	margin-left: 20px;
	margin-right: 20px;
}
</style>
