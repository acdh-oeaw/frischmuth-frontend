import { createApiClient } from "../lib/api.ts";

export default defineNuxtPlugin({
	name: "api",
	setup() {
		const config = useRuntimeConfig();
		const apiBaseUrl = config.public.apiBaseUrl;
		const client = createApiClient(apiBaseUrl);
		return {
			provide: {
				api: client,
			},
		};
	},
});
