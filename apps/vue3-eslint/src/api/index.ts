import { setupAxiosInterceptors } from '@pnpm-monorepo/utils';
import { ElNotification } from 'element-plus';

const { get, post } = setupAxiosInterceptors({
    url: import.meta.env.VITE_API_URL,
    notification: (message: any) => {
        ElNotification({
            title: '错误',
            message: message,
            type: 'error',
            zIndex: 9999,
        });
    },
});

export { get, post };
