import { useLogStore } from "@/stores/logStore";
import * as xlsx from "xlsx";
import { WorkBook, WorkSheet } from "xlsx";
import { useXlsxStore } from "../stores/xlsxStore";
import { serialize, deserialize, compress, decompress } from "./MessagePackUtil";

// 类型定义
type ParsedData = Record<string, Record<string, Record<string, any>>>;

const addLog = (message: string, type: 'info' | 'error' | 'success', path?: string) => {
  useLogStore().add({ message, type, path });
};

const parseCell = (cellValue: any): any => {
  if (typeof cellValue !== "string") return cellValue;

  const sanitizedValue = cellValue.replace(/=/g, ':').replace(/([{,])(\w+)(:)/g, '$1"$2"$3');

  try {
    return JSON.parse(sanitizedValue);
  } catch (e) {
    return sanitizedValue;
  }
};

const getCellValue = (worksheet: WorkSheet, row: number, col: number): any => {
  const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
  const cell = worksheet[cellAddress];
  return cell ? parseCell(cell.v) : undefined;
};

// 工作表解析函数
const parseWorksheet = (worksheet: WorkSheet): Record<string, any> => {
  const { e: { r: maxRow, c: maxCol } } = xlsx.utils.decode_range(worksheet['!ref'] || 'A1');
  const keyCount = getCellValue(worksheet, 1, 0) || 0;

  return keyCount === 0
    ? parseSimpleWorksheet(worksheet, maxRow, maxCol)
    : parseComplexWorksheet(worksheet, maxRow, maxCol, keyCount);
};

const parseSimpleWorksheet = (worksheet: WorkSheet, maxRow: number, maxCol: number): Record<string, any> => {
  const options: xlsx.Sheet2JSONOpts = {
    header: 1,
    range: { s: { r: 4, c: 2 }, e: { r: maxRow, c: maxCol } },
    defval: ''
  };
  const rows: any[][] = xlsx.utils.sheet_to_json(worksheet, options);

  return rows.reduce((acc, [fieldName, value]) => {
    if (fieldName) acc[fieldName] = parseCell(value);
    return acc;
  }, {} as Record<string, any>);
};

const parseComplexWorksheet = (worksheet: WorkSheet, maxRow: number, maxCol: number, keyCount: number): Record<string, any> => {
  const options: xlsx.Sheet2JSONOpts = {
    header: 1,
    range: { s: { r: 2, c: 1 }, e: { r: maxRow, c: maxCol } },
    defval: ''
  };
  const [headers, , ...rows] = xlsx.utils.sheet_to_json(worksheet, options) as any[][];
  const logStore = useLogStore();
  return rows.reduce((acc, row) => {
    const keys = row.slice(0, keyCount);
    const values = row.slice(keyCount);

    let currentLevel = acc;
    keys.forEach((key, index) => {
      if (!key) {
        addLog(`在第 ${index + 1} 列找不到有效的键名`, 'error');
        return;
      }

      if (typeof key !== 'number') {
        addLog(`key必须是数字：${key}`, 'error');
        return;
      }

      if (index === keyCount - 1) {
        currentLevel[key] = createDataObject(headers.slice(keyCount), values);

      } else {
        currentLevel[key] ||= {};
        currentLevel = currentLevel[key];
      }
    });

    return acc;
  }, {} as Record<string, any>);
};

const createDataObject = (headers: string[], values: any[]): Record<string, any> => {
  return headers.reduce((acc, header, index) => {
    if (header) acc[header] = parseCell(values[index]);
    return acc;
  }, {} as Record<string, any>);
};

// 工作簿解析函数
export const parseWorkbook = (workbookList: WorkBook[]): ParsedData | null => {
  if (!workbookList.length) {
    return null;
  }
  return workbookList.reduce((acc, workbook) => {
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const titleCell = worksheet[xlsx.utils.encode_cell({ r: 0, c: 0 })];
      if (titleCell) {
        acc[titleCell.v] = parseWorksheet(worksheet);
        addLog(`正在解析 ${titleCell.v}`, 'info');
      }
    });
    return acc;
  }, {} as ParsedData);
};

// 文件读取和导出函数
export const xlsRead = async (type: number): Promise<ParsedData | null> => {
  const store = useXlsxStore();
  const files = store.xlsFileList;
  const selectedXls = type === 0 ? files.filter(file => file.isSelected) : files;

  addLog('正在读取数据...', 'info');
  const excelDataList = await Promise.all(
    selectedXls.map(xls => window.electronAPI.invoke("read-excel", `${store.importPath}/${xls.name}`))
  );

  return parseWorkbook(excelDataList);
};

function generateLargeJson(size: number): any {
  const largeJson: any = {};
  for (let i = 0; i < size; i++) {
    largeJson[`key${i}`] = {
      id: i,
      name: `Item ${i}`,
      values: Array.from({ length: 100 }, (_, j) => `Value ${j}`),
      nested: {
        flag: i % 2 === 0,
        count: i * 10,
        items: Array.from({ length: 50 }, (_, k) => ({
          subId: k,
          subValue: `SubValue ${k}`
        }))
      }
    };
  }
  return largeJson;
}

export const compressData = async () => {
  //记录用时
  const startTime = Date.now();
  const store = useXlsxStore();
  const path = store.exportPath;
  const outputFileName = "config.data";
  const outputFilePath = path + "/" + outputFileName;

  try {
    //找到路径下面的所有JSON文件
    addLog(`正在读取数据...`, 'info');
    // const combinedData: { [key: string]: any } = await window.electronAPI.invoke("get-json-map-in-directory", path);
    const combinedData = generateLargeJson(50000);
    //如果数据为空，则不进行压缩
    if (Object.keys(combinedData).length === 0) {
      addLog(`没有找到任何JSON数据，请先导出JSON数据`, 'error');
      return;
    }

    addLog(`原始数据大小：${(JSON.stringify(combinedData).length / 1024).toFixed(2)} kb`, 'info');
    addLog(`正在序列化数据...`, 'info');
    const serializedData = serialize(combinedData);
    addLog(`序列化后大小：${(serializedData.length / 1024).toFixed(2)} kb`, 'info');
    addLog(`正在压缩数据...`, 'info');
    const compressedData = compress(serializedData);
    addLog(`压缩后大小：${(compressedData.length / 1024).toFixed(2)} kb`, 'info');
    addLog(`正在写入文件...`, 'info');

    await window.electronAPI.invoke("write-file", outputFilePath, compressedData);

    addLog(`压缩率：${((1 - compressedData.length / JSON.stringify(combinedData).length) * 100).toFixed(2)}%`, 'info');
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    addLog(`执行用时：${duration} 秒`, 'info');
    addLog(`已导出文件：${outputFileName}`, 'success', outputFilePath);

  } catch (error) {
    addLog((error as Error).message, 'error');
  }
}

export const processAndExportData = async (type: number, exportPath: string): Promise<void> => {
  const data = await xlsRead(type);

  if (!data) {
    addLog('无效的数据格式', 'error');
    throw new Error('无效的数据格式');
  }

  // const largeJson = generateLargeJson(1000);

  // console.log(`原始数据：`, data);
  // console.log(`原始数据大小：${JSON.stringify(data).length} 字节`);

  // try {
  //   const buffer = serialize(data);
  //   console.log("序列化后大小:", buffer.length, "字节");

  //   const compressedBuffer = compress(buffer);
  //   console.log("压缩后大小:", compressedBuffer.length, "字节");

  //   const decompressedBuffer = decompress(compressedBuffer);
  //   console.log("解压后大小:", decompressedBuffer.length, "字节");

  //   const deserialized = deserialize(decompressedBuffer);
  //   console.log("反序列化后的数据:", deserialized);

  //   const compressionRatio = (1 - compressedBuffer.length / JSON.stringify(data).length) * 100;
  //   console.log("压缩率:", compressionRatio.toFixed(2) + "%");
  // } catch (error) {
  //   console.error("序列化或反序列化过程中出错:", error);
  // }


  await Promise.all(
    Object.entries(data).map(async ([configName, configData]) => {

      const fileName = `${configName}.json`;
      addLog(`正在处理 ${fileName}`, 'info');
      try {
        const filePath = await window.electronAPI.invoke("join-paths", exportPath, fileName);
        await window.electronAPI.invoke("write-file", filePath, JSON.stringify(configData, null, 2));
        addLog(`已导出文件 ${fileName}`, 'success', filePath);

      } catch (error) {
        addLog((error as Error).message, 'error');
      }
    })
  );
};