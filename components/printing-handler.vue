<script setup lang="ts">
import { PrinterIcon } from "lucide-vue-next";
import { ref } from "vue";
import { useVueToPrint } from "vue-to-print";

import type { Characters } from "~/pages/work/[id].vue";

import PrintView from "./print-view.vue";

const componentRef = ref();

const props = defineProps<{
	characters: Characters;
	places: object;
	relatedWork: object;
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
		// Clear the old content from the print area
		printArea.innerHTML = "";

		// Iterate through each element ID and append it if it exists
		elementsToPrint.forEach(({ id, title }) => {
			let element = document.getElementById(id);
			if (element) {
				// Create a heading before each content section
				const heading = document.createElement("h2");
				heading.textContent = title;
				heading.classList.add("print-heading");

				if (id === "print-accordion-Charaktere") {
					if (element != null) {
						const characterNames: Array<string> = [];

						props.characters.main?.forEach((el) => {
							if (el.name != null) {
								characterNames.push(el.name);
							}
						});
						const characterNamesString = characterNames.join(", ");
						const charHeading = document.createElement("h3");
						charHeading.textContent = "Hauptcharaktere";
						const characterNamesElement = document.createElement("p");
						characterNamesElement.textContent = characterNamesString;

						printArea.appendChild(charHeading);
						// Append it to the print area
						element = characterNamesElement;
					}
				}

				if (id === "print-accordion-Orte") {
					const characters = document.querySelectorAll("#print-accordion-Orte #place");
					const characterNames: Array<string> = [];
					characters.forEach((el) => {
						const characterName = el.textContent?.trim().replace(" Ort anzeigen", "");
						if (characterName) {
							characterNames.push(characterName);
						}
					});

					const characterNamesString = characterNames.join(", ");
					const characterNamesElement = document.createElement("p");
					characterNamesElement.textContent = characterNamesString;

					// Append it to the print area

					element = characterNamesElement;
				}

				if (id === "print-accordion-Bezüge") {
					const characters = document.querySelectorAll("#print-accordion-Bezüge #relatedWork");
					const characterNames: Array<string> = [];
					characters.forEach((el) => {
						const characterName = el.textContent?.trim().replace(" Bezug anzeigen", "");
						if (characterName) {
							characterNames.push(characterName);
						}
					});

					const characterNamesString = characterNames.join(", ");
					const characterNamesElement = document.createElement("p");
					characterNamesElement.textContent = characterNamesString;

					// Append it to the print area
					element = characterNamesElement;
				}

				if (id === "print-analysis") {
					element.classList.add("no-padding");
					heading.classList.add("page-break");
				}

				if (id === "print-metadata") {
					element.classList.add("hide-buttons");
				}

				printArea.appendChild(heading); // Append heading before the content
				printArea.appendChild(element.cloneNode(true));
			}
		});
	}
};

const { handlePrint } = useVueToPrint({
	content: componentRef,
	documentTitle: "DetailView_Digitales_Archiv_Barbara_Frischmuth",
	removeAfterPrint: true,
	onBeforePrint: async () => {
		cloneContentForPrint();
		await nextTick(); // Make sure DOM updates before printing
	},
});
</script>

<template>
	<div>
		<Button
			class="m-0 h-full items-center gap-1 bg-frisch-grey px-2 py-1 text-xs shadow-none hover:bg-frisch-grey/90"
			@click="handlePrint"
		>
			<PrinterIcon :size="16" />
			Drucken
		</Button>

		<div ref="componentRef" class="sr-only print:not-sr-only">
			<PrintView />
		</div>
	</div>
</template>
