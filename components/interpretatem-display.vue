<script setup lang="ts">
import type { Interpretatem } from "~/types/api";

defineProps<{
	interpretatems: Interpretatem | undefined;
}>();
</script>

<template>
	<h3 class="m-0 py-2 text-lg font-semibold">Interpretateme</h3>
	<div v-for="(interpretatemGroup, groupIndex) in interpretatems" :key="groupIndex" class="pb-3">
		<div v-if="interpretatemGroup">
			<div v-for="(item, itemIndex) in interpretatemGroup.sources" :key="itemIndex" class="pb-1">
				<div v-if="item" class="flex flex-row gap-1 font-medium">
					<div v-if="item.authors && item.authors.length > 0">
						{{
							item.authors
								.map((author) => {
									const forename = author.forename?.trim() || "";
									const surname = author.surname?.trim() || "";
									const fullName = [forename, surname].filter(Boolean).join(" ");

									return fullName || author.fallback_name || "Unbekannter Autor";
								})
								.join(", ")
						}}
					</div>
					<div>in</div>
					<NuxtLink
						id="interpretatem-work"
						class="underline decoration-dotted transition hover:no-underline focus-visible:no-underline"
						:href="`/work/${item.id}`"
					>
						<span>{{ item.title }}</span>
					</NuxtLink>
				</div>
			</div>
			<div class="pb-1">
				<!-- eslint-disable-next-line vue/no-v-html -->
				<div class="prose min-w-full text-black" v-html="interpretatemGroup.description" />
			</div>
		</div>
		<div v-else class="text-sm text-muted-foreground">Keine genaueren Informationen vorhanden.</div>
	</div>
</template>

<style scoped>
.prose :deep(a) {
	@apply underline font-normal decoration-dotted transition hover:no-underline focus-visible:no-underline;
}
</style>
