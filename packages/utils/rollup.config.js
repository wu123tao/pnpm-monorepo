import typescript from 'rollup-plugin-typescript2';

export default {
    // 入口
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.esm.js', // package.json 中 "module": "dist/index.esm.js"
            format: 'esm', // es module 形式的包， 用来import 导入， 可以tree shaking
        },
        {
            file: 'dist/index.cjs.js', // package.json 中 "main": "dist/index.cjs.js",
            format: 'cjs', // commonjs 形式的包， require 导入
        },
        {
            file: 'dist/index.umd.js',
            name: 'GLWidget',
            format: 'umd', // umd 兼容形式的包， 可以直接应用于网页 script
        },
    ],
    plugins: [typescript()],
};
