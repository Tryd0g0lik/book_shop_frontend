// eslint.config.mts
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";
import stylisticTs  from '@stylistic/eslint-plugin';
// const TypescriptEslintParser = require('@typescript-eslint/parser');

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "next-env.d.ts",
    "**/*.d.ts",
    "*conf*.*",
    ".vscode/**",
    ".git/**",
    ".github/**",
    ".husky/**",
    "coverage/**",
    "*.min.js",
  ]),
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js, stylisticTs, }, 
    extends: ["js/recommended", stylisticTs.configs['recommended'], tseslint.configs.recommended,], 

    languageOptions: {
       globals: globals.browser, ecmaVersion:2021,
       parser: tseslint.parser,
       parserOptions: {
          project: './tsconfig.json',
          tsconfigRootDir: import.meta.dirname,
        }
      },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
      }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
    }
   },
  
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
  
]);
