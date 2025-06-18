<script lang="ts" setup>
import type { Author, RelatedWorkItem } from "~/types/work";

const props = defineProps<{
	relatedWork: Array<RelatedWorkItem> | undefined;
	relation: string;
}>();

const relationType: Record<string, string> = {
	references: "Referenziert",
	discusses: "Diskutiert",
	mentions: "Erwähnt",
	referencedIn: "Wurde referenziert in",
	discussedIn: "Wurde diskutiert in",
	mentionedIn: "Wurde erwähnt in",
};

function getValidAuthorNames(authors: Array<Partial<Author>>): Array<string> {
	return authors
		.map((a) => a?.surname?.trim() || a?.forename?.trim() || a?.fallback_name?.trim() || "")
		.filter((name) => name !== "");
}
</script>

<template>
	<div>
		<div class="pb-2 font-semibold">{{ relationType[props.relation] }}</div>
		<div v-if="props.relatedWork && props.relatedWork.length > 0">
			<div v-for="work in props.relatedWork" :key="work.id">
				<div class="pb-2">
					<template v-if="getValidAuthorNames(work.authors || []).length > 0">
						<span> {{ getValidAuthorNames(work.authors ?? []).join(", ") }}: </span>
					</template>
					<NuxtLink
						id="relatedWork-references"
						class="underline decoration-dotted transition hover:no-underline focus-visible:no-underline"
						:href="`/work/${work.id}`"
					>
						<span>{{ work.title }}</span>
					</NuxtLink>
				</div>
			</div>
		</div>
		<div v-else class="text-sm text-muted-foreground">Keine Bezüge vorhanden.</div>
	</div>
</template>
