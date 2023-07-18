module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        '@vue/typescript/recommended',
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': 'error',
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/multi-word-component-names': 'off',
    },
};
