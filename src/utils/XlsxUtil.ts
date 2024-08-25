import * as xlsx from "xlsx";
import {WorkBook, WorkSheet} from "xlsx";
import {useXlsxOptionsStore} from "../stores/XlsxOptionsStore.ts";
import {ElNotification} from "element-plus";

// 导出 parseWorkbook 函数
export function parseWorkbook(workbookList: WorkBook[]): Object | null {
	if (!workbookList || workbookList.length === 0) {
		ElNotification({
			title: '提示',
			message: '请选择要解析的Excel文件',
			type: 'error',
			duration: 2000
		});
		return null;
	}

	let map: any = {};

	for (let xls of workbookList) {
		// 遍历工作簿对象，获取所有sheet页
		for (const sheetName of xls.SheetNames) {
			// 获取当前sheet页
			const worksheet: WorkSheet = xls.Sheets[sheetName];
			//总共有多少列
			const range = xlsx.utils.decode_range(worksheet['!ref'] || "");
			const colCount = range.e.c - range.s.c + 1;
			const rowCount = range.e.r - range.s.r + 1;

			let names: string[] = [];
			for (let j = 1; j <= colCount; j++) {
				const cellAddress = xlsx.utils.encode_cell({r: 2, c: j});
				const cell = worksheet[cellAddress];

				if (cell) {
					names.push(cell.v);
				}
			}

			let workbookMap: { [key: string]: any } = {};

			for (let k = 0; k < names.length; k++) {
				for (let m = 4; m < rowCount; m++) {
					let name = names[k];
					let o = workbookMap[name] ||= {};

					const cellAddress = xlsx.utils.encode_cell({r: m, c: k + 1});
					const cell = worksheet[cellAddress];
					let v = cell ? cell.v : undefined;

					if (typeof v === "string") {
						v = v.replace(/=/g, ':');
						v = v.replace(/([{,])(\w+)(:)/g, '$1"$2"$3');
					}

					try {
						o[m - 3] = JSON.parse(v);

					} catch (e) {
						o[m - 3] = v;
					}
				}
			}

			const address = xlsx.utils.encode_cell({r: 0, c: 0});
			const xlsxName = worksheet[address];
			map[xlsxName.v] = workbookMap;
		}
	}

	Object.keys(map).length > 0 && ElNotification({
		title: '提示',
		message: '解析成功',
		type: 'success',
		duration: 2000
	});
	return map;
}

export async function xlsRead(type: number): Promise<Object | null> {
	let store = useXlsxOptionsStore();
	const selectedXls = type === 0 ? store.selectedXls : store.xlsxList;
	let excelDataList: WorkBook[] = [];

	for (let i = 0; i < selectedXls.length; i++) {
		const data: WorkBook = await new Promise((resolve) => {
			let path = store.xlsPath + "/" + selectedXls[i].name;
			window.electronAPI.receiveOnce("excel-data", (data: WorkBook) => {
				resolve(data);
			});

			window.electronAPI.send("read-excel", path);
		});
		excelDataList.push(data);
	}

	return parseWorkbook(excelDataList);
}