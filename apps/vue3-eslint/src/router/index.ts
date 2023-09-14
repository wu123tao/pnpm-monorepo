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
    {
        path: '/edit-table',
        name: '/edit-table',
        component: () => import('@/view/edit-table/table.vue'),
        meta: {
            title: '编辑表格',
        },
    },
    {
        path: '/export-xlsx',
        name: '/export-xlsx',
        component: () => import('@/view/export-xlsx/export-xlsx.vue'),
        meta: {
            title: '导出表格',
        },
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
