import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    "dist/",
    ".astro/",
    ".vercel/",
    "playwright-report/",
    "test-results/",
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      "@typescript-eslint/no-deprecated": "error",
    },
  },
  {
    // astro-eslint-parser has no projectService; it needs the older `project` option.
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: { projectService: false, project: true },
    },
  },
  {
    files: ["**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
    rules: { "@typescript-eslint/no-deprecated": "off" },
  },
  eslintConfigPrettier,
);
