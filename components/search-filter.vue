<script lang="ts" setup>
import { XIcon } from "lucide-vue-next";
import type { LocationQueryValue } from "vue-router";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { SearchResultFacets } from "@/types/api";

const route = useRoute();
const router = useRouter();

const primaryWork = [
	{
		label: "Prosa",
		subterms: [
			"Roman",
			"Erzählung",
			"Literarischer Text",
			"Poetik-Vorlesung",
			"Kinder- und Jugendbuch",
			"Rede",
			"Essay",
			"Vorlesung",
			"Rezension",
		],
	},
	{ label: "Lyrik", subterms: [] },
	{ label: "Dramatik", subterms: ["Drama", "Hörspieldrehbuch", "Filmdrehbuch, Filmvorlage"] },
	{
		label: "Veröffentlichung in audiovisuellen Medien",
		subterms: [
			"Hörspiel",
			"Film",
			"Kinder- und Jugendproduktion",
			"Hörspieübersetzung, Hörspielbearbeitung",
			"Literatursendung",
			"Anderweitiger Beitrag in audiovisuellen Medien",
		],
	},
	{ label: "Paratext" },
	{ label: "Abbildung" },
];

const secondaryWork = [
	{
		label: "Akademische Rezeption",
		subterms: ["Monografie", "Sammelband", "Artikel", "Journalartikel", "Hochschulschrift"],
	},
	{
		label: "Journalistische Rezeption",
		subterms: [
			"Besprechung",
			"Bericht",
			"Ankündigung",
			"Porträt",
			"Anderweitiger Beitrag in audiovisuellen Medien",
		],
	},
	{
		label: "Produktive Rezeption",
		subterms: ["Drama-, Opernaufführung", "Nachdichtung von Barbara Frischmuth"],
	},
];

const checkedFacets = computed(() => {
	const languageValue: Array<LocationQueryValue> | LocationQueryValue | undefined =
		route.query.language;
	const topicValue: Array<LocationQueryValue> | LocationQueryValue | undefined = route.query.topic;

	return {
		language: Array.isArray(languageValue) ? languageValue : languageValue ? [languageValue] : [],
		topic: Array.isArray(topicValue) ? topicValue : topicValue ? [topicValue] : [],
	} as { language: Array<string>; topic: Array<string> };
});

const props = defineProps<{
	facets: SearchResultFacets | null;
}>();

const showMore = ref(false);

function toggleShowMore() {
	showMore.value = !showMore.value;
}

const sortedTopics = computed(() => {
	if (props.facets?.topic == null) return null;

	const sorted = props.facets.topic.slice().sort((a, b) => {
		return Number(b.count) - Number(a.count);
	});

	if (showMore.value) {
		return sorted;
	}

	return sorted.slice(0, 10);
});

const selectedCheckboxes = ref<Array<string>>([]);
const filterCount = ref(0);

watch(
	checkedFacets,
	({ language, topic }) => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		filterCount.value = (language?.length || 0) + (topic?.length || 0);
		selectedCheckboxes.value = [];
	},
	{ immediate: true },
);

const isCheckBoxActive = computed(() => selectedCheckboxes.value.length > 0);

function addCheckbox(value: string) {
	const index = selectedCheckboxes.value.indexOf(value);
	if (index > -1) {
		selectedCheckboxes.value.splice(index, 1);
	} else {
		selectedCheckboxes.value.push(value);
	}
}

function removeFilter() {
	const newQuery = { ...route.query };

	if (newQuery.language) delete newQuery.language;
	if (newQuery.topic) delete newQuery.topic;

	void router.push({ query: newQuery });
	selectedCheckboxes.value = [];
}

const slider = { min: 1940, max: 2024 };
const sliderValue = ref([slider.min, slider.max]);

function toggleWork(workLabel: string, subterms: Array<string>) {
	const isChecked = selectedCheckboxes.value.includes(workLabel);

	updateSelectedCheckboxes(workLabel, !isChecked);

	subterms.forEach((subterm) => {
		updateSelectedCheckboxes(subterm, !isChecked);
	});
}

function toggleSubterm(subtermLabel: string, workLabel: string, subterms: Array<string>) {
	const isChecked = selectedCheckboxes.value.includes(subtermLabel);

	updateSelectedCheckboxes(subtermLabel, !isChecked);

	const areAllSubtermsChecked = subterms.every((subterm) =>
		selectedCheckboxes.value.includes(subterm),
	);

	updateSelectedCheckboxes(workLabel, areAllSubtermsChecked);
}

function updateSelectedCheckboxes(label: string, isChecked: boolean) {
	if (isChecked) {
		if (!selectedCheckboxes.value.includes(label)) {
			selectedCheckboxes.value.push(label);
		}
	} else {
		const index = selectedCheckboxes.value.indexOf(label);
		if (index > -1) {
			selectedCheckboxes.value.splice(index, 1);
		}
	}
}
</script>

<template>
	<div class="px-6">
		<div class="bg-frisch-orange-super-light p-6">
			<div class="text-lg font-medium text-frisch-orange">
				<div class="pb-4">
					<div class="grid grid-cols-2 items-center">
						<span class="pb-2 text-xl">Filterung</span>
						<div class="ml-auto grid grid-cols-[1fr_auto] items-center">
							<span class="text-sm">Aktive Filter ({{ filterCount }})</span>
							<Button
								v-if="filterCount > 0"
								type="reset"
								class="items-center p-2"
								variant="searchform"
								@click="removeFilter()"
							>
								<div class="bg-frisch-orange">
									<XIcon :size="12" class="font-bold text-white" />
								</div>
							</Button>
						</div>
					</div>
					<Separator class="bg-frisch-orange"></Separator>
				</div>
				<!-- FIX ME: Make checkbox groups!-->
				<div class="pb-4">
					<Accordion type="single" collapsible default-value="medium">
						<AccordionItem value="medium">
							<AccordionTrigger>
								<div class="text-lg">Werktyp | Primärliteratur</div>
							</AccordionTrigger>
							<AccordionContent>
								<div class="flex py-3">
									<div class="flex w-full flex-col">
										<div v-for="work in primaryWork" :key="work.label">
											<div class="grid grid-cols-[auto_1fr] items-center pb-1">
												<Checkbox
													id="medium1"
													type="checkbox"
													:checked="selectedCheckboxes.includes(work.label)"
													@click="toggleWork(work.label, work.subterms ? work.subterms : [])"
												/>
												<label for="medium1" class="pl-2 font-medium">{{ work.label }}</label>
											</div>
											<div
												v-if="work.subterms != null && work.subterms.length > 0"
												class="grid pb-3 pl-5"
											>
												<div v-for="subterm in work.subterms" :key="subterm">
													<div class="grid grid-cols-[auto_1fr] items-center">
														<Checkbox
															id="medium1"
															type="checkbox"
															:checked="selectedCheckboxes.includes(subterm)"
															@click="toggleSubterm(subterm, work.label, work.subterms)"
														/>
														<label for="medium1" class="pl-2 text-sm font-normal">
															{{ subterm }}
														</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator class="bg-frisch-orange"></Separator>
				</div>
				<div class="pb-4">
					<Accordion type="single" collapsible default-value="medium">
						<AccordionItem value="medium">
							<AccordionTrigger>
								<div class="text-lg">Werktyp | Sekundärliteratur</div>
							</AccordionTrigger>
							<AccordionContent>
								<div class="flex py-3">
									<div class="flex w-full flex-col">
										<div v-for="work in secondaryWork" :key="work.label">
											<div class="grid grid-cols-[auto_1fr] items-center pb-1">
												<Checkbox
													id="medium1"
													type="checkbox"
													:checked="selectedCheckboxes.includes(work.label)"
													@click="toggleWork(work.label, work.subterms)"
												/>
												<label for="medium1" class="pl-2 font-medium">{{ work.label }}</label>
											</div>
											<div
												v-if="work.subterms != null && work.subterms.length > 0"
												class="grid pb-3 pl-5"
											>
												<div v-for="subterm in work.subterms" :key="subterm">
													<div class="grid grid-cols-[auto_1fr] items-center">
														<Checkbox
															id="medium1"
															type="checkbox"
															:checked="selectedCheckboxes.includes(subterm)"
															@click="toggleSubterm(subterm, work.label, work.subterms)"
														/>
														<label for="medium1" class="pl-2 text-sm font-normal">
															{{ subterm }}
														</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator class="bg-frisch-orange"></Separator>
				</div>
				<div class="pb-4">
					<Accordion type="single" collapsible default-value="year">
						<AccordionItem value="year">
							<AccordionTrigger>
								<div class="text-lg">Erscheinungsjahr</div>
							</AccordionTrigger>
							<AccordionContent>
								<div class="w-full py-3 text-sm font-normal">
									<div class="grid w-full grid-cols-[1fr_auto] pb-4">
										<div>{{ sliderValue[0] }}</div>
										<div>{{ sliderValue[1] }}</div>
									</div>
									<Slider
										v-model="sliderValue"
										class="pb-3"
										:max="slider.max"
										:min="slider.min"
										:step="1"
									/>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator class="bg-frisch-orange"></Separator>
				</div>
				<div class="pb-4">
					<Accordion type="single" collapsible default-value="language">
						<AccordionItem value="language">
							<AccordionTrigger>
								<div class="text-lg">Sprache</div>
							</AccordionTrigger>
							<AccordionContent>
								<div
									v-if="props.facets?.language && props.facets?.language.length > 0"
									class="py-3 text-sm font-normal"
								>
									<fieldset class="grid grid-cols-2">
										<legend class="sr-only">Sprachen</legend>
										<div
											v-for="(item, index) in props.facets?.language"
											:key="item.key"
											class="grid grid-cols-[auto_1fr]"
											@value-change="addCheckbox(item.key!)"
										>
											<label class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-2">
												<input
													:id="`language${index}`"
													name="language"
													:value="item.key"
													type="checkbox"
													:checked="checkedFacets.language ? checkedFacets.language.includes(item.key!) : false"
													class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
													@change="addCheckbox(item.key!)"
												/>
												<span>{{ item.key }}</span>
											</label>
											<span class="pl-1 text-frisch-grey">({{ item.count }})</span>
										</div>
									</fieldset>
								</div>

								<div v-else class="py-3 text-frisch-grey">
									Keine weiteren Filtermöglichkeiten vorhanden.
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator class="bg-frisch-orange"></Separator>
				</div>
				<div class="pb-4">
					<Accordion type="single" collapsible default-value="topic">
						<AccordionItem value="topic">
							<AccordionTrigger>
								<div class="text-lg">Thema</div>
							</AccordionTrigger>
							<AccordionContent>
								<div
									v-if="sortedTopics && sortedTopics.length > 0"
									class="py-3 text-sm font-normal"
								>
									<fieldset class="grid grid-cols-2">
										<legend class="sr-only">Themen</legend>
										<div
											v-for="(item, index) in sortedTopics"
											:key="item.key"
											class="grid grid-cols-[auto_1fr]"
											@value-change="addCheckbox(item.key!)"
										>
											<label class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-2">
												<input
													:id="`topic${index}`"
													name="topic"
													:value="item.key"
													type="checkbox"
													:checked="checkedFacets.topic ? checkedFacets.topic.includes(item.key!) : false"
													class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
													@change="addCheckbox(item.key!)"
												/>
												<span>{{ item.key }}</span>
											</label>
											<span class="pl-1 text-frisch-grey">({{ item.count }})</span>
										</div>
									</fieldset>
								</div>
								<div v-else class="py-3 text-frisch-grey">
									Keine weiteren Filtermöglichkeiten vorhanden.
								</div>
								<Button
									v-if="sortedTopics"
									variant="searchform"
									type="button"
									class="p-0 pb-2 text-sm font-medium"
									@click="toggleShowMore"
								>
									{{ showMore ? `Weniger anzeigen` : `Mehr anzeigen ...` }}
								</Button>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator class="bg-frisch-orange"></Separator>
					<div v-if="isCheckBoxActive" class="flex w-full justify-end pt-4 text-sm">
						<Button variant="frischMarine" type="submit">Filter anwenden</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
