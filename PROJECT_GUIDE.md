# 项目开发指南

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [开发环境设置](#开发环境设置)
5. [开发流程](#开发流程)
6. [构建和部署](#构建和部署)
7. [核心功能](#核心功能)
8. [最佳实践](#最佳实践)
9. [常见问题解答](#常见问题解答)
10. [package.json 优化指南](#packagejson-优化指南)

## 项目概述

vite-xls 是一个基于 Electron 和 Vue 的 Excel 处理应用。它允许用户导入 Excel 文件，进行处理，并导出为 JSON 或其他格式。

## 技术栈

- Electron
- Vue 3
- TypeScript
- Vite
- Pinia (状态管理)
- Element Plus (UI 组件库)
- XLSX (Excel 文件处理)

## 项目结构

```vite-xls/
├── src/ # Vue 应用源代码
│ ├── assets/ # 静态资源
│ ├── components/ # Vue 组件
│ ├── stores/ # Pinia 状态管理
│ ├── utils/ # 工具函数
│ ├── views/ # 页面组件
│ ├── App.vue # 根组件
│ └── main.ts # 应用入口
├── electron/ # Electron 主进程代码
├── public/ # 公共资源
├── dist/ # 构建输出目录 (Vue)
├── dist_electron/ # 构建输出目录 (Electron)
└── release/ # 发布输出目录
```

## 开发环境设置

1. 确保已安装 Node.js (>= 14.0.0)
2. 克隆项目仓库
3. 运行 `yarn install` 安装依赖
4. 使用 `yarn dev` 启动开发服务器

## 开发流程

1. 使用 `yarn dev` 启动开发服务器
2. 在 `src` 目录下进行 Vue 应用开发
3. 在 `electron` 目录下进行 Electron 相关开发
   - 主要关注 `index.ts` 和 `preload.ts` 文件
   - 使用 IPC 通信在主进程和渲染进程之间传递消息
4. 使用 `yarn lint` 进行代码检查
5. 使用 `yarn test` 运行测试（如果已配置）

## 构建和部署

1. 使用 `yarn build` 构建应用
2. 使用 `yarn pack:mac` (或 `pack:win`, `pack:linux`) 打包应用
3. 打包后的应用将位于 `release` 目录

## 核心功能

1. Excel 文件导入
   - 使用 `src/utils/excelUtil.ts` 中的 `xlsRead` 函数
   - 支持单文件和批量文件导入

```typescript:src/utils/excelUtil.ts
startLine: 108
endLine: 117
```

2. 数据处理
   - 使用 `src/utils/excelUtil.ts` 中的 `parseWorkbook` 函数
   - 支持简单和复杂的 Excel 结构解析

```typescript:src/utils/excelUtil.ts
startLine: 90
endLine: 105
```

3. JSON 导出
   - 使用 `src/utils/excelUtil.ts` 中的 `processAndExportData` 函数
   - 支持选择性导出和全量导出

```typescript:src/utils/excelUtil.ts
startLine: 119
endLine: 132
```

## 最佳实践

1. 遵循 Vue 3 组合式 API 的最佳实践
2. 使用 Pinia 进行状态管理
3. 使用 TypeScript 类型注解提高代码质量
4. 遵循 Electron 安全指南
5. 定期更新依赖以修复潜在的安全问题
6. 使用 `window.electronAPI` 在 Vue 组件中调用 Electron 功能

## 常见问题解答

1. Q: 如何添加新的依赖？
   A: 使用 `yarn add <package-name>` 添加新依赖，使用 `yarn add -D <package-name>` 添加开发依赖。

2. Q: 如何处理 Electron 安全警告？
   A: 遵循 Electron 安全指南，避免使用不安全的 API，适当配置 CSP。

3. Q: 如何更新应用版本？
   A: 更新 `package.json` 中的版本号，然后运行 `yarn release` 生成更新日志。

4. Q: 如何调试主进程？
   A: 使用 `yarn start:debug` 启动调试模式，然后在 VSCode 中附加调试器。

5. Q: 如何在 Vue 组件中调用 Electron 的 API？
   A: 使用 `window.electronAPI.invoke()` 方法调用在 preload 脚本中定义的 API。例如：
   ```typescript
   const result = await window.electronAPI.invoke("read-excel", filePath);
   ```

# package.json 优化指南

## 1. 依赖项优化

### 原理

- 使用 `peerDependencies` 来管理主要框架依赖
- 定期更新依赖版本以修复安全问题和获得新功能

### 示例

```json
{
	"dependencies": {
		"animejs": "^3.2.2",
		"electron-updater": "^6.2.1"
	},
	"peerDependencies": {
		"vue": "^3.4.35",
		"electron": "^32.0.1"
	},
	"devDependencies": {
		"vue": "^3.4.35",
		"electron": "^32.0.1"
	}
}
```

### 好处

- 减少包体积
- 增加灵活性
- 避免版本冲突

## 2. 脚本优化

### 原理

- 添加代码质量检查和测试流程
- 使用 Git hooks 自动运行检查

### 示例

```json
{
	"scripts": {
		"lint": "eslint . --ext .js,.ts,.vue",
		"test": "jest",
		"prepare": "husky install"
	}
}
```

### 好处

- 提高代码质量
- 保持一致的编码风格
- 自动化测试，提高可靠性
- 在 Git 操作前自动运行检查

## 3. 项目元数据

### 原理

- 提供更多项目相关信息

### 示例

```json
{
	"description": "一个基于Electron和Vue的Excel处理应用",
	"author": "您的名字 <your.email@example.com>",
	"license": "MIT",
	"repository": {
		"type": "git",
		"url": "https://github.com/yourusername/vite-xls.git"
	},
	"keywords": ["electron", "vue", "excel", "spreadsheet"]
}
```

### 好处

- 提高项目可发现性
- 提供清晰的项目描述和作者信息
- 指定许可证类型
