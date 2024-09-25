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

	const sorted = props.facets.topic.toSorted((a, b) => {
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
						<div class="grid grid-cols-2 py-3 text-sm font-normal">
							<div class="flex w-full flex-col"></div>
						</div>
						<AccordionItem value="medium">
							<AccordionTrigger>
								<div class="text-lg">Medium</div>
							</AccordionTrigger>
							<AccordionContent>
								<div class="grid grid-cols-2 py-3 text-sm font-normal">
									<div class="flex w-full flex-col">
										<div class="flex items-center">
											<Checkbox id="medium1" type="checkbox" />
											<label for="medium1" class="pl-2">Buch</label>
										</div>
										<div class="flex items-center">
											<Checkbox id="medium2" type="checkbox" />
											<label for="medium2" class="pl-2">Buchteil</label>
										</div>
										<div class="flex items-center">
											<Checkbox id="medium3" type="checkbox" />
											<label for="medium3" class="pl-2">Sekundärliteratur</label>
										</div>
									</div>
									<div class="flex w-full flex-col">
										<div class="flex items-center">
											<Checkbox id="medium4" type="checkbox" />
											<label for="medium4" class="pl-2">Hörspiel</label>
										</div>
										<div class="flex items-center">
											<Checkbox id="medium5" type="checkbox" />
											<label for="medium5" class="pl-2">Artikel</label>
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
						<div class="grid grid-cols-2 py-3 text-sm font-normal">
							<div class="flex w-full flex-col"></div>
						</div>
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
						<div class="grid grid-cols-2 py-3 text-sm font-normal">
							<div class="flex w-full flex-col"></div>
						</div>
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
						<div class="grid grid-cols-2 py-3 text-sm font-normal">
							<div class="flex w-full flex-col"></div>
						</div>
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
