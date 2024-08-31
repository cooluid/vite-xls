import { defineStore } from "pinia";
export interface LogEntry {
    message: string,
    type: 'info' | 'success' | 'warning' | 'error',
    time?: string,
    path?: string
}
export const useLogStore = defineStore('log', {
    state: () => ({
        logList: [] as LogEntry[]
    }),
    actions: {
        add(msgItem: LogEntry): void {
            const time = new Date().toLocaleTimeString();
            this.logList.push({ ...msgItem, time });
        },

        clear(): void {
            this.logList.length = 0;
        }
    }
});