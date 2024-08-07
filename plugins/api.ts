import { createApiClient } from "@/lib/api.ts";

export default defineNuxtPlugin({
	name: "api-client",
	setup() {
		const config = useRuntimeConfig();
		const apiBaseUrl = config.public.apiBaseUrl;

		const client = createApiClient(apiBaseUrl, {
			axiosConfig: {
				paramsSerializer: {
					indexes: false,
				},
			},
		});

		return {
			provide: {
				api: client,
			},
		};
	},
});
