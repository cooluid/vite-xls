import { defineStore } from "pinia";
export interface LogEntry {
    mssage: string,
    type: 'info' | 'success' | 'warning' | 'error'
}
export const useLogStore = defineStore('log', {
    state: () => ({
        logList: [] as LogEntry[]
    }),
    actions: {
        add(msgItem: LogEntry): void {
            this.logList.push(msgItem);
        },

        clear(): void {
            this.logList.length = 0;
        }
    }
});