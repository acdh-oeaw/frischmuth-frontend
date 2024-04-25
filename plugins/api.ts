import { createApiClient } from "../lib/api.ts";

export default defineNuxtPlugin({
	name: "api",
	setup() {
		const config = useRuntimeConfig();
		const apiBaseUrl = config.public.NUXT_PUBLIC_API_BASE_URL;
		const client = createApiClient(apiBaseUrl);
		return {
			provide: {
				api: client,
			},
		};
	},
});
