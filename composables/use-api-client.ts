export function useApiClient() {
	const env = useRuntimeConfig();

	const client = createApiClient({ baseUrl: env.public.NUXT_PUBLIC_API_BASE_URL });

	return client;
}
