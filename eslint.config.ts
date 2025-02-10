import baseConfig from "@acdh-oeaw/eslint-config";
import nodeConfig from "@acdh-oeaw/eslint-config-node";
import nuxtConfig from "@acdh-oeaw/eslint-config-nuxt";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import tailwindcssConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import vueConfig from "@acdh-oeaw/eslint-config-vue";
import gitignore from "eslint-config-flat-gitignore";
import type { Config } from "typescript-eslint";

import { withNuxt } from "./.nuxt/eslint.config.mjs";

const config: Config = [
	gitignore({ strict: false }),
	...baseConfig,
	...vueConfig,
	...nuxtConfig,
	...tailwindcssConfig,
	...playwrightConfig,
	{
		rules: {
			"vue/attributes-order": ["warn", { alphabetical: true }],
		},
	},
	...nodeConfig.map((config) => {
		return {
			files: ["server/**/*.ts"],
			...config,
		};
	}),
];

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
export default withNuxt(config as any);
