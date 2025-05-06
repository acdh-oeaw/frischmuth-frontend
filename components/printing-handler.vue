<script setup lang="ts">
import { PrinterIcon } from "lucide-vue-next";
import { ref } from "vue";
import { useVueToPrint } from "vue-to-print";

import type { Characters, Places, RelatedWork } from "~/types/work";

import PrintView from "./print-view.vue";

const componentRef = ref();

const props = defineProps<{
	characters: Characters;
	places: Places;
	relatedWork: RelatedWork;
}>();

const cloneContentForPrint = () => {
	const elementsToPrint = [
		{ id: "print-metadata", title: "" },
		{ id: "print-accordion-Kontexte", title: "Kontexte" },
		{ id: "print-accordion-Charaktere", title: "Charaktere" },
		{ id: "print-accordion-Orte", title: "Orte" },
		{ id: "print-accordion-Bezüge", title: "Bezüge" },
		{ id: "print-accordion-Physische Objekte", title: "Physische Objekte" },
		{ id: "print-analysis", title: "Analyse" },
	];

	const printArea = document.getElementById("print-slot");

	if (printArea) {
		printArea.innerHTML = "";

		elementsToPrint.forEach(({ id, title }) => {
			const element = document.getElementById(id);
			if (element) {
				const heading = document.createElement("h2");
				heading.textContent = title;
				heading.classList.add("print-heading");

				if (id === "print-accordion-Charaktere") {
					printArea.appendChild(heading);

					const characterSections: Array<{
						key: keyof Characters;
						title: string;
					}> = [
						{ key: "main", title: "Hauptcharaktere" },
						{ key: "secondary", title: "Nebencharaktere" },
						{ key: "spokenOf", title: "Erwähnte Charaktere" },
					];

					characterSections.forEach(({ key, title }) => {
						const characters = props.characters[key];
						const subHeading = document.createElement("h3");
						subHeading.textContent = title;
						printArea.appendChild(subHeading);

						if (characters && characters.length > 0) {
							const names = characters
								.map((c) => c.name)
								.filter((name): name is string => Boolean(name));

							if (names.length > 0) {
								const namesParagraph = document.createElement("p");
								namesParagraph.textContent = names.join(", ");
								printArea.appendChild(namesParagraph);
								return;
							}
						}

						const fallbackParagraph = document.createElement("p");
						fallbackParagraph.textContent = "Keine Charaktere vorhanden.";
						printArea.appendChild(fallbackParagraph);
					});

					return;
				}
				if (id === "print-accordion-Orte") {
					printArea.appendChild(heading);

					const placeSections: Array<{
						key: keyof Places;
						title: string;
					}> = [
						{ key: "takesPlaceIn", title: "Schauplätze" },
						{ key: "discussed", title: "Beschriebene Orte" },
						{ key: "mentioned", title: "Erwähnte Orte" },
					];

					placeSections.forEach(({ key, title }) => {
						const places = props.places[key];
						const subHeading = document.createElement("h3");
						subHeading.textContent = title;
						printArea.appendChild(subHeading);

						if (places && places.length > 0) {
							const names = places
								.map((p) => p.name)
								.filter((name): name is string => Boolean(name));

							if (names.length > 0) {
								const namesParagraph = document.createElement("p");
								namesParagraph.textContent = names.join(", ");
								printArea.appendChild(namesParagraph);
								return;
							}
						}

						const fallbackParagraph = document.createElement("p");
						fallbackParagraph.textContent = "Keine Orte vorhanden.";
						printArea.appendChild(fallbackParagraph);
					});

					return;
				}
				if (id === "print-accordion-Bezüge") {
					printArea.appendChild(heading);

					const relatedWorkSections: Array<{
						key: keyof RelatedWork;
						title: string;
					}> = [
						{ key: "references", title: "Erwähnte Werke" },
						{ key: "referencedIn", title: "Wurde erwähnt in" },
						{ key: "discussedIn", title: "Wurde besprochen in" },
					];

					relatedWorkSections.forEach(({ key, title }) => {
						const works = props.relatedWork[key];
						const subHeading = document.createElement("h3");
						subHeading.textContent = title;
						printArea.appendChild(subHeading);

						if (works && works.length > 0) {
							const titles = works
								.map((w) => w.title)
								.filter((title): title is string => Boolean(title));

							if (titles.length > 0) {
								const titlesParagraph = document.createElement("p");
								titlesParagraph.textContent = titles.join(", ");
								printArea.appendChild(titlesParagraph);
								return;
							}
						}

						const fallbackParagraph = document.createElement("p");
						fallbackParagraph.textContent = "Keine Bezüge vorhanden.";
						printArea.appendChild(fallbackParagraph);
					});

					return;
				}
				if (id === "print-analysis") {
					element.classList.add("no-padding");
					heading.classList.add("page-break");
				}

				if (id === "print-metadata") {
					element.classList.add("hide-buttons");
				}

				printArea.appendChild(heading);
				printArea.appendChild(element.cloneNode(true));
			}
		});
	}
};

const preparePrintContent = (): Promise<void> => {
	return new Promise((resolve) => {
		nextTick();

		cloneContentForPrint();

		nextTick();

		requestAnimationFrame(() => {
			resolve();
		});
	});
};

const printWithPreparation = async () => {
	await preparePrintContent();
	await nextTick();

	requestAnimationFrame(() => {
		handlePrint();
	});
};

const { handlePrint } = useVueToPrint({
	content: componentRef,
	documentTitle: "DetailView_Digitales_Archiv_Barbara_Frischmuth",
	removeAfterPrint: true,
});

const handleKeydown = (event: KeyboardEvent) => {
	if ((event.ctrlKey || event.metaKey) && event.key === "p") {
		event.preventDefault();
		printWithPreparation();
	}
};

onMounted(() => {
	window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
	window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
	<div>
		<Button
			class="m-0 h-6 items-center gap-1 bg-frisch-grey px-2 text-xs shadow-none hover:bg-frisch-grey/90"
			@click="printWithPreparation"
		>
			<PrinterIcon :size="16" />
			Drucken
		</Button>

		<div ref="componentRef" class="sr-only print:not-sr-only">
			<PrintView />
		</div>
	</div>
</template>
