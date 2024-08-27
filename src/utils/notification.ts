import { ElNotification } from "element-plus";

type NotificationType = 'success' | 'warning' | 'error' | 'info';

export const showNotification = (message: string, type: NotificationType = 'success'): void => {
    ElNotification({
        title: '提示',
        message,
        type,
        duration: 2000
    });
};
