declare global {
    interface Window {
        electronAPI: {
            send: (channel: string, data: any) => void;
            invoke: (channel: string, ...args: any[]) => Promise<any>;
            receive: (channel: string, func: (...args: any[]) => void) => void;
            receiveOnce: (channel: string, func: (...args: any[]) => void) => void;
        };
    }
}

export { }