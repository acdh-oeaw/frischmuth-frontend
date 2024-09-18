import { handlers } from "@/mock/handlers";

export default defineNuxtMswWorkerOption(() => {
	return {
		handlers,
		onWorkerStarted(worker, nuxtApp) {
			nuxtApp.hook("app:mounted", () => {
				console.log("Worker is started");
			});
		},
	};
});
