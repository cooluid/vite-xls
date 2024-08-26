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

function parseWorksheet(worksheet: WorkSheet): { [key: string]: any } {
  const range = xlsx.utils.decode_range(worksheet['!ref'] || "");
  const colCount = range.e.c - range.s.c + 1;
  const rowCount = range.e.r - range.s.r + 1;

  const columnNames = Array.from({ length: colCount }, (_, j) => {
    const cellAddress = xlsx.utils.encode_cell({ r: HEADER_ROW, c: j + 1 });
    const cell = worksheet[cellAddress];
    return cell ? cell.v : '';
  });

  const parsedData: { [key: string]: any } = {};

  columnNames.forEach((name, colIndex) => {
    if (!name) return;

    const columnData: { [key: number]: any } = {};
    for (let rowIndex = DATA_START_ROW; rowIndex < rowCount; rowIndex++) {
      const cellAddress = xlsx.utils.encode_cell({ r: rowIndex, c: colIndex + 1 });
      const cell = worksheet[cellAddress];
      columnData[rowIndex - DATA_START_ROW + 1] = cell ? parseCell(cell.v) : undefined;
    }
    parsedData[name] = columnData;
  });

  return parsedData;
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