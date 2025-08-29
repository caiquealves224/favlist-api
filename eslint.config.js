import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    prettierConfig,
    {
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            parser: typescriptEslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        plugins: {
            prettier: prettier,
            '@typescript-eslint': typescriptEslint.plugin,
        },
        rules: {
            // Regras de tipagem TypeScript
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-misused-promises': 'error',

            // Integração com Prettier
            'prettier/prettier': 'error',
        },
    },
    {
        ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts'],
    }
);
