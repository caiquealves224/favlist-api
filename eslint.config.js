import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    prettierConfig,
    {
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            prettier: prettier,
        },
        rules: {
            // Regras básicas do ESLint
            'no-unused-vars': 'error',
            'no-console': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',

            // Integração com Prettier
            'prettier/prettier': 'error',
        },
    },
    {
        ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts'],
    },
];
