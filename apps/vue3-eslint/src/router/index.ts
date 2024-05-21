import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import i18n from '@/lang';

export const routes = computed<RouteRecordRaw[]>(() => [
    {
        path: '/',
        name: '/',
        component: () => import('@/view/home/home.vue'),
        meta: {
            title: `${i18n.global.t('menu.home')}`,
        },
    },
    {
        path: '/socket-io',
        name: 'socket-io',
        component: () => import('@/view/socket-io/socket-io.vue'),
        meta: {
            title: `socket-io`,
        },
    },
    {
        path: '/file-upload',
        name: '/file-upload',
        component: () => import('@/view/file-upload/file-upload.vue'),
        meta: {
            title: `${i18n.global.t('menu.upload')}`,
        },
    },
    {
        path: '/edit-table',
        name: '/edit-table',
        component: () => import('@/view/edit-table/table.vue'),
        meta: {
            title: `${i18n.global.t('menu.editTable')}`,
        },
    },
    {
        path: '/export-xlsx',
        name: '/export-xlsx',
        component: () => import('@/view/export-xlsx/export-xlsx.vue'),
        meta: {
            title: `${i18n.global.t('menu.exportExcel')}`,
        },
    },
]);

export const router = createRouter({
    history: createWebHistory(),
    routes: routes.value,
});
