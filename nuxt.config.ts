import { fileURLToPath } from "node:url";

import { defaultLocale, localesMap } from "./config/i18n.config";

const baseUrl = process.env.NUXT_PUBLIC_APP_BASE_URL!;

export default defineNuxtConfig({
	alias: {
		"@": fileURLToPath(new URL("./", import.meta.url)),
	},

	app: {
		layoutTransition: false,
		pageTransition: false,
	},

	colorMode: {
		classSuffix: "",
		dataValue: "ui-color-scheme",
	},

	components: [{ extensions: [".vue"], path: "@/components", pathPrefix: false }],

	content: {
		defaultLocale,
		locales: Object.keys(localesMap),
		markdown: {},
	},

	css: [
		"@fontsource-variable/inter/standard.css",
		"@fontsource-variable/inter/standard-italic.css",
		"@/styles/shadcn-ui.css",
		"@/styles/index.css",
	],

	devtools: {
		enabled: process.env.NODE_ENV === "development",
	},

	eslint: {
		config: {
			autoInit: false,
			standalone: true,
		},
	},

	experimental: {
		componentIslands: {
			selectiveClient: true,
		},
		defaults: {
			useAsyncData: {
				deep: false,
			},
			useFetch: {
				timeout: 250,
			},
		},
		inlineRouteRules: true,
		/**
		 * @see https://github.com/nuxt-modules/i18n/issues/3240
		 */
		scanPageMeta: true,
		// typedPages: true,
	},

	features: {
		/** @see https://github.com/nuxt/nuxt/issues/21821 */
		inlineStyles(id) {
			// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
			return id != null && id.includes(".vue");
		},
	},

	// future: {
	// 	compatibilityVersion: 4,
	// },

	i18n: {
		baseUrl,
		defaultLocale,
		detectBrowserLanguage: {
			redirectOn: "root",
		},
		// experimental: {
		// 	typedOptionsAndMessages: "default",
		// },
		langDir: "./messages",
		lazy: true,
		locales: Object.values(localesMap),
		strategy: "prefix_except_default",
		vueI18n: "./i18n.config.ts",
	},

	imports: {
		dirs: ["./config/"],
	},

	mdc: {
		remarkPlugins: {
			/** @see https://github.com/nuxt-modules/mdc/issues/187 */
			"remark-emoji": false,
		},
	},

	modules: [
		"@nuxt/content",
		"@nuxt/eslint",
		"@nuxt/image",
		"@nuxtjs/color-mode",
		"@nuxtjs/i18n",
		"@nuxtjs/mdc",
		"@vueuse/nuxt",
	],

	nitro: {
		compressPublicAssets: true,
		prerender: {
			routes: ["/manifest.webmanifest", "/robots.txt", "/sitemap.xml"],
		},
	},

	postcss: {
		plugins: {
			tailwindcss: {},
		},
	},

	runtimeConfig: {
		NODE_ENV: process.env.NODE_ENV,
		public: {
			apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
			appBaseUrl: process.env.NUXT_PUBLIC_APP_BASE_URL,
			bots: process.env.NUXT_PUBLIC_BOTS,
			googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
			matomoBaseUrl: process.env.NUXT_PUBLIC_MATOMO_BASE_URL,
			matomoId: process.env.NUXT_PUBLIC_MATOMO_ID,
			redmineId: process.env.NUXT_PUBLIC_REDMINE_ID,
		},
	},

	typescript: {
		shim: false,
		strict: true,
		// https://github.com/nuxt/nuxt/issues/14816#issuecomment-1484918081
		tsConfig: {
			compilerOptions: {
				paths: {
					"@/*": ["./*"],
				},
			},
		},
	},

	compatibilityDate: "2025-01-01",
});
