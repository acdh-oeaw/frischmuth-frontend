import baseConfig from "@acdh-oeaw/eslint-config";
import nodeConfig from "@acdh-oeaw/eslint-config-node";
import nuxtConfig from "@acdh-oeaw/eslint-config-nuxt";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import tailwindcssConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import vueConfig from "@acdh-oeaw/eslint-config-vue";
import { defineConfig } from "eslint/config";
import gitignore from "eslint-config-flat-gitignore";

import { withNuxt } from "./.nuxt/eslint.config.mjs";

const config = defineConfig(
	gitignore({ strict: false }),
	{
		extends: [baseConfig, vueConfig, nuxtConfig, tailwindcssConfig, playwrightConfig],
	},
	{
		rules: {
			"better-tailwindcss/enforce-consistent-class-order": "warn",
			"better-tailwindcss/no-unknown-classes": "warn",
			"vue/attributes-order": ["warn", { alphabetical: true }],
		},
	},
	{
		files: ["server/**/*.ts"],
		extends: [nodeConfig],
		languageOptions: {
			parserOptions: {
				project: "./.nuxt/tsconfig.server.json",
				projectService: false,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
);

export default withNuxt(config).remove("nuxt/vue/single-root");
