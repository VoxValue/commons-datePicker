import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";

export default [
    { ignores: ["dist/**", "assets/**", "app/**"] },
    js.configs.recommended,
    {
        files: ["*.config.js", "*.config.mjs", "*.config.ts"],
        languageOptions: {
            globals: { ...globals.node }
        }
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module"
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "react-refresh": reactRefreshPlugin,
            import: importPlugin
        },
        settings: {
            react: { version: "detect" }
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            indent: "off",
            "no-console": "warn",
            quotes: "error",
            semi: "error",
            "import/order": [
                "error",
                {
                    alphabetize: { order: "asc", caseInsensitive: true },
                    "newlines-between": "always"
                }
            ],
            "react/react-in-jsx-scope": "off",
            "react-refresh/only-export-components": "warn",
            "@typescript-eslint/no-var-requires": 0
        }
    }
];
