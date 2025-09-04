<script setup lang="ts">
import "@citation-js/plugin-bibtex";
import "@citation-js/plugin-csl";

// @ts-expect-error missing types for citation-js
import Cite, { plugins } from "citation-js";
import { ArrowDownToLine, CopyIcon, MessageSquareQuote, XIcon } from "lucide-vue-next";

import type { ExpressionData } from "@/types/api";

const props = defineProps<{
	metadata: ExpressionData;
	persons: Array<{ forename: string; surname: string }>;
}>();

const bibtex = ref("");
const apa = ref("");
const ris = ref("");
const copied = ref(false);

const currentTab = ref("apa");
const isDisabled = ref(false);

const customCSL = ref<string | null>(null);

const templateName = "customAPA";

onMounted(async () => {
	try {
		const response = await fetch("/styles/citation-stylesheet.csl");
		if (!response.ok) throw new Error("Failed to fetch CSL");
		const cslText = await response.text();

		customCSL.value = cslText;
		const template = plugins.config.get("@csl");
		template.templates.add(templateName, customCSL.value);
	} catch (error) {
		console.error("Error loading CSL file:", error);
	}
});

const citation = computed(() => {
	const citations = (props.metadata || []).flatMap((refs) => {
		return refs?.map((ref) => {
			return {
				author:
					ref?.persons && ref?.persons.length <= 0
						? props.persons.map((author) => {
								return { given: author.forename, family: author.surname };
							})
						: ref?.persons?.map((author) => {
								return { given: author.forename, family: author.surname };
							}),
				title: ref?.title ?? "",
				language: ref?.language?.join(", ") ?? "",
				publication_date: ref?.publication_date ?? "",
				publisher: ref.publisher?.name ?? "",
				"publisher-place": ref?.place_of_publication?.[0]?.name ?? "",
				issued: ref?.publication_date ? { "date-parts": [[ref.publication_date]] } : undefined,
			};
		});
	});
	return new Cite(citations);
});

watchEffect(() => {
	if (citation.value.data.length <= 0) {
		isDisabled.value = true;
		return;
	}

	bibtex.value = citation.value.format("bibtex");
	ris.value = citation.value.format("ris");

	if (customCSL.value) {
		apa.value = citation.value.format("bibliography", {
			format: "html",
			template: templateName,
			lang: "de-DE",
		});
	} else {
		apa.value = citation.value.format("bibliography", {
			format: "html",
			template: "apa",
			lang: "de-DE",
		});
	}
});

function copyToClipboard() {
	try {
		if (currentTab.value === "bibtext") {
			navigator.clipboard.writeText(bibtex.value);
		} else if (currentTab.value === "apa") {
			const text = new DOMParser().parseFromString(apa.value, "text/html").body.textContent;
			navigator.clipboard.writeText(text ?? "");
		} else {
			navigator.clipboard.writeText(ris.value);
		}
		copied.value = true;
	} catch (err) {
		console.error("Failed to copy:", err);
	}
}

function downloadBibTeX() {
	if (currentTab.value === "bibtex") {
		const blob = new Blob([bibtex.value], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "citation.bib";
		a.click();
		URL.revokeObjectURL(url);
	} else {
		const blob = new Blob([ris.value], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "citation.ris";
		a.click();
		URL.revokeObjectURL(url);
	}
}

let timer: ReturnType<typeof setTimeout> | null = null;

function resetCopied() {
	timer = setTimeout(() => {
		copied.value = false;
	}, 300);
}

watch(
	() => {
		return currentTab.value;
	},
	() => {
		copied.value = false;
	},
);

onScopeDispose(() => {
	if (timer != null) {
		clearTimeout(timer);
	}
});
</script>

<template>
	<div ref="citation-container">
		<AlertDialog>
			<AlertDialogTrigger :disabled="isDisabled">
				<Button
					class="m-0 h-full items-center gap-1 bg-frisch-grey px-2 py-1 text-xs shadow-none hover:bg-frisch-grey/90"
					:disabled="isDisabled"
				>
					<MessageSquareQuote :size="16" />
					Zitieren
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogCancel
						class="absolute right-4 top-4 px-3 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
						@click="resetCopied()"
					>
						<XIcon :size="16" />
					</AlertDialogCancel>
					<AlertDialogTitle>Zitieren</AlertDialogTitle>
					<AlertDialogDescription>
						<Tabs class="w-full" default-value="apa">
							<TabsList class="mb-4 w-full">
								<TabsTrigger class="w-full" value="apa" @click="currentTab = 'apa'">
									APA (modifiziert)
								</TabsTrigger>
								<TabsTrigger class="w-full" value="bibtex" @click="currentTab = 'bibtex'">
									BibTeX
								</TabsTrigger>
								<TabsTrigger class="w-full" value="ris" @click="currentTab = 'ris'">
									RIS
								</TabsTrigger>
							</TabsList>
							<div class="h-40 max-w-md overflow-y-auto outline outline-1 outline-frisch-grey/50">
								<TabsContent class="p-2 text-black" value="bibtex">
									<pre>{{ bibtex }}</pre>
								</TabsContent>
								<TabsContent class="p-2 text-black" value="apa">
									<!-- eslint-disable-next-line vue/no-v-html -->
									<span v-html="apa" />
								</TabsContent>
								<TabsContent class="p-2 text-black" value="ris">
									<pre>{{ ris }}</pre>
								</TabsContent>
							</div>
						</Tabs>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter :class="currentTab !== 'apa' ? `grid grid-cols-2 gap-1` : `flex w-full`">
					<Button
						:class="currentTab !== 'apa' ? `gap-1 text-sm` : `w-full text-sm gap-1`"
						:disabled="copied"
						variant="pagination"
						@click="copyToClipboard()"
					>
						<CopyIcon v-if="!copied" :size="16" />
						<span> {{ copied ? "Kopiert!" : "Kopieren" }}</span>
					</Button>
					<Button
						v-show="currentTab !== 'apa'"
						class="gap-1 text-sm"
						variant="pagination"
						@click="downloadBibTeX()"
					>
						<ArrowDownToLine :size="16" />
						<span>Download</span>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</div>
</template>
