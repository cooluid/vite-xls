declare global {
    interface Window {
        electronAPI: {
            send: (channel: string, data: any) => void;
            receive: (channel: string, func: (...args: any[]) => void) => void;
            receiveOnce: (channel: string, func: (...args: any[]) => void) => void;
        };
    }
}

export { }