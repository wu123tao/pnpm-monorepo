import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: '/',
        component: () => import('@/view/home/home.vue'),
        meta: {
            title: '首页',
        },
    },
    {
        path: '/file-upload',
        name: '/file-upload',
        component: () => import('@/view/file-upload/file-upload.vue'),
        meta: {
            title: '文件上传',
        },
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
