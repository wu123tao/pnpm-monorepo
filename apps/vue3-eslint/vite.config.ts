import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import VueDevTools from 'vite-plugin-vue-devtools';

const pathSrc = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': pathSrc,
        },
    },
    plugins: [
        vue(),
        AutoImport({
            imports: ['vue'],
            resolvers: [ElementPlusResolver()],
            dts: './src/types/auto-import.d.ts',
        }),
        Components({
            resolvers: [ElementPlusResolver()],
            dts: './src/types/components.d.ts',
        }),
        VueDevTools(),
    ],
});
