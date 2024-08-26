import * as xlsx from "xlsx";
import { WorkBook, WorkSheet } from "xlsx";
import { useXlsxOptionsStore } from "../stores/XlsxOptionsStore.ts";
import { ElNotification } from "element-plus";

interface ParsedData {
  [key: string]: {
    [key: string]: {
      [key: number]: any;
    };
  };
}

const HEADER_ROW = 2;
const DATA_START_ROW = 4;

export function showNotification(message: string, type: 'success' | 'error' = 'success') {
  ElNotification({
    title: '提示',
    message,
    type,
    duration: 2000
  });
}

function parseCell(cellValue: string): any {
  if (typeof cellValue !== "string") return cellValue;

  const sanitizedValue = cellValue.replace(/=/g, ':').replace(/([{,])(\w+)(:)/g, '$1"$2"$3');

  try {
    return JSON.parse(sanitizedValue);
  } catch (e) {
    return sanitizedValue;
  }
}

//根据列数和行数获取所有对应单元格的值
function getCellValues(worksheet: WorkSheet, startRow: number, endRow: number, col: number): any[] {
  const parsedDataList: any[] = [];

  for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
    const cellAddress = xlsx.utils.encode_cell({ r: rowIndex, c: col });
    const cell = worksheet[cellAddress];
    parsedDataList.push(cell ? parseCell(cell.v) : undefined);
  }


  return parsedDataList;
}

//根据行数和列数获取所有对应单元格的值
function getCellValuesByRowAndCol(worksheet: WorkSheet, startCol: number, endCol: number, row: number): any[] {
  const parsedDataList: any[] = [];

  for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
    const cellAddress = xlsx.utils.encode_cell({ r: row, c: colIndex });
    const cell = worksheet[cellAddress];
    parsedDataList.push(cell ? parseCell(cell.v) : undefined);
  }

  return parsedDataList;
}

//根据某行格子获取值
function getCellValue(worksheet: WorkSheet, row: number, col: number): any {
  const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
  const cell = worksheet[cellAddress];
  return cell ? parseCell(cell.v) : undefined;
}

function parseWorksheet(worksheet: WorkSheet): { [key: string]: any } {
  const range = xlsx.utils.decode_range(worksheet['!ref'] || "");
  const colCount = range.e.c - range.s.c;
  const rowCount = range.e.r - range.s.r;

  //获取A2单元格值
  const keyNum = getCellValue(worksheet, 1, 0);
  const firstKeyValues = getCellValues(worksheet, 4, rowCount, 1);//[1,2,3,4,5,6,7,8,9,10]
  //一层的数据
  let map: { [key: string]: any } = {};
  let propertyList = getCellValuesByRowAndCol(worksheet, 1, colCount, 2);//["a","b","c","d","e","f","g","h","i","j"];
  let valueMap: { [key: string]: any } = {};

  for (let i = 0; i < firstKeyValues.length; i++) {
    valueMap[i] = getCellValuesByRowAndCol(worksheet, 1, colCount, i + 4);
  }

  //创建键值对
  for (let i = 0; i < firstKeyValues.length; i++) {
    let key = firstKeyValues[i];
    for (let j = 0; j < propertyList.length; j++) {
      let p = propertyList[j];
      let v = valueMap[i][j];
      let o: { [key: string]: any } = {};
      o[p] = v;
      map[key] = { ...map[key], ...o };
    }
  }

  let endMap: { [key: string]: any } = {};
  for (let i = keyNum; i > 0; i--) {

  }
  // const columnNames = Array.from({ length: colCount }, (_, j) => {
  //   const cellAddress = xlsx.utils.encode_cell({ r: HEADER_ROW, c: j + 1 });
  //   const cell = worksheet[cellAddress];
  //   return cell ? cell.v : '';
  // });

  // const parsedData: { [key: string]: any } = {};

  // columnNames.forEach((name, colIndex) => {
  //   if (!name) return;

  //   const columnData: { [key: number]: any } = {};
  //   for (let rowIndex = DATA_START_ROW; rowIndex < rowCount; rowIndex++) {
  //     const cellAddress = xlsx.utils.encode_cell({ r: rowIndex, c: colIndex + 1 });
  //     const cell = worksheet[cellAddress];
  //     columnData[rowIndex - DATA_START_ROW + 1] = cell ? parseCell(cell.v) : undefined;
  //   }
  //   parsedData[name] = columnData;
  // });

  return map;
}

export function parseWorkbook(workbookList: WorkBook[]): ParsedData | null {
  if (!workbookList || workbookList.length === 0) {
    showNotification('请选择要解析的Excel文件', 'error');
    return null;
  }

  const parsedData: ParsedData = {};

  for (const workbook of workbookList) {
    for (const sheetName of workbook.SheetNames) {
      const worksheet: WorkSheet = workbook.Sheets[sheetName];
      const sheetData = parseWorksheet(worksheet);

      const titleCellAddress = xlsx.utils.encode_cell({ r: 0, c: 0 });
      const titleCell = worksheet[titleCellAddress];
      if (titleCell) {
        parsedData[titleCell.v] = sheetData;
      }
    }
  }

  return parsedData;
}

export async function xlsRead(type: number): Promise<ParsedData | null> {
  const store = useXlsxOptionsStore();
  const selectedXls = type === 0 ? store.selectedXls : store.xlsxList;
  const excelDataList: WorkBook[] = [];

  for (const xls of selectedXls) {
    const path = `${store.xlsPath}/${xls.name}`;
    const data: WorkBook = await window.electronAPI.invoke("read-excel", path);
    excelDataList.push(data);
  }

  return parseWorkbook(excelDataList);
}

export async function processAndExportData(type: number, exportPath: string): Promise<void> {
  const map = await xlsRead(type);
  if (!map || typeof map !== 'object') {
    throw new Error('无效的数据格式');
  }

  console.log(map);

  for (const [configName, configData] of Object.entries(map)) {
    const fileName = `${configName}.json`;
    const filePath = await window.electronAPI.invoke("join-paths", exportPath, fileName);
    await window.electronAPI.invoke("write-file", filePath, JSON.stringify(configData, null, 2));
  }

  showNotification('导出成功');
}