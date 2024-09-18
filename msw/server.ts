import { handlers } from "@/mock/handlers";

export default defineNuxtMswServerOption(() => {
	return {
		baseURL: "http://localhost:3000", // this is the baseURL for our Nuxt App, not the API!
		handlers,
		serverOptions: {
			onUnhandledRequest: "bypass",
		},
		onRequest() {
			console.log("A server request is made");
		},
	};
});
