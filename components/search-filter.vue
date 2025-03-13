<script lang="ts" setup>
import { XIcon } from "lucide-vue-next";
import type { LocationQueryValue } from "vue-router";

import type { SearchResultFacets } from "@/types/api";

interface workType {
	id: number;
	key: string;
	count: number;
	children: Array<workType> | null;
}

const route = useRoute();
const router = useRouter();

const slider = { min: 1940, max: 2025 };
const sliderValue = ref([slider.min, slider.max]);

const checkedFacets = computed(() => {
	const startYearValue: Array<LocationQueryValue> | LocationQueryValue | undefined =
		route.query.startYear;
	const endYearValue: Array<LocationQueryValue> | LocationQueryValue | undefined =
		route.query.endYear;
	const workTypeValue: Array<LocationQueryValue> | LocationQueryValue | undefined =
		route.query.workType;
	const languageValue: Array<LocationQueryValue> | LocationQueryValue | undefined =
		route.query.language;
	const topicValue: Array<LocationQueryValue> | LocationQueryValue | undefined = route.query.topic;

	return {
		startYear: startYearValue ? startYearValue : "",
		endYear: endYearValue ? endYearValue : "",
		workType: Array.isArray(workTypeValue) ? workTypeValue : workTypeValue ? [workTypeValue] : [],
		language: Array.isArray(languageValue) ? languageValue : languageValue ? [languageValue] : [],
		topic: Array.isArray(topicValue) ? topicValue : topicValue ? [topicValue] : [],
	} as {
		startYear: string;
		endYear: string;
		language: Array<string>;
		topic: Array<string>;
		workType: Array<string>;
	};
});

const props = defineProps<{
	facets: SearchResultFacets | null;
	filterCount: number;
}>();

const yearChecked = ref(false);

function sortChildrenByCount(item: workType) {
	if (!item.children) return item;

	const sortedChildren: Array<workType> = item.children
		.slice()
		.sort((a, b) => b.count - a.count)
		.map((child) => sortChildrenByCount(child));

	return {
		...item,
		children: sortedChildren,
	};
}

const primaryWork = computed(() => {
	const primary =
		props.facets?.work_type?.find((work_type) => work_type.key === "Primärwerk") ?? null;

	return primary ? sortChildrenByCount(primary as workType) : primary;
});

const secondaryWork = computed(() => {
	const secondary =
		props.facets?.work_type?.find((work_type) => work_type.key === "Rezeption/Sekundärwerk") ??
		null;

	return secondary ? sortChildrenByCount(secondary as workType) : secondary;
});

const showMore = ref(false);

function toggleShowMore() {
	showMore.value = !showMore.value;
}

function resetSlider() {
	setTimeout(() => {
		sliderValue.value = [slider.min, slider.max];
	}, 100);
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

watch(
	checkedFacets,
	() => {
		selectedCheckboxes.value = [];
		if (checkedFacets.value.endYear !== "" && checkedFacets.value.startYear !== "") {
			yearChecked.value = true;
			sliderValue.value = [
				Number(checkedFacets.value.startYear),
				Number(checkedFacets.value.endYear),
			];
		} else yearChecked.value = false;
	},
	{ immediate: true },
);

const isCheckBoxActive = computed(() => selectedCheckboxes.value.length > 0);
const hasSliderChanged = ref(false);

function onSliderChange() {
	hasSliderChanged.value = true;
}

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
	if (newQuery.workType) delete newQuery.workType;
	if (newQuery.startYear) delete newQuery.startYear;
	if (newQuery.endYear) delete newQuery.endYear;

	void router.push({ query: newQuery });
	selectedCheckboxes.value = [];
	yearChecked.value = false;
}

function toggleWork(key: string, subterms: Array<workType>) {
	const isChecked = selectedCheckboxes.value.includes(key);

	updateSelectedCheckboxes(key, !isChecked);

	subterms.forEach((subterm) => {
		updateSelectedCheckboxes(subterm.key as unknown as string, !isChecked);
		if (subterm.children != null && subterm.children.length > 0) {
			subterm.children.forEach((subterm) => {
				updateSelectedCheckboxes(subterm.key as unknown as string, !isChecked);
			});
		}
	});
}

function toggleSubterm(key: string) {
	const isChecked = selectedCheckboxes.value.includes(key);
	updateSelectedCheckboxes(key, !isChecked);
}

function updateSelectedCheckboxes(id: string, isChecked: boolean) {
	if (isChecked) {
		if (!selectedCheckboxes.value.includes(id)) {
			selectedCheckboxes.value.push(id);
		}
	} else {
		const index = selectedCheckboxes.value.indexOf(id);
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
							<span class="text-sm">Aktive Filter ({{ props.filterCount }})</span>
							<Button
								v-if="props.filterCount > 0"
								class="items-center p-2"
								type="reset"
								variant="searchform"
								@click="removeFilter()"
							>
								<div class="bg-frisch-orange">
									<XIcon class="font-bold text-white" :size="12" />
								</div>
							</Button>
						</div>
					</div>
					<Separator class="bg-frisch-orange"></Separator>
				</div>
				<div class="pb-4">
					<div class="pb-4">
						<Accordion collapsible default-value="work_type_primary" type="single">
							<AccordionItem value="work_type_primary">
								<div
									:class="
										primaryWork != null && primaryWork.count > 0
											? `grid grid-cols-[auto_1fr] items-center gap-2`
											: `grid w-full items-center`
									"
								>
									<div v-if="primaryWork != null">
										<input
											:id="`workType` + primaryWork.id"
											:checked="
												(checkedFacets.workType
													? checkedFacets.workType.includes(primaryWork.key)
													: false) || selectedCheckboxes.includes(primaryWork.key)
											"
											class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
											name="workType"
											type="checkbox"
											:value="primaryWork.key"
											@change="
												toggleWork(primaryWork.key as unknown as string, primaryWork.children ?? [])
											"
										/>
										<label class="sr-only pl-2 font-medium" :for="`workType` + primaryWork.id">
											{{ primaryWork.key }}
										</label>
									</div>
									<AccordionTrigger>
										<div class="grid grid-cols-[auto_1fr] items-center gap-2">
											<div class="text-lg">
												Primärliteratur
												<span class="text-sm text-frisch-grey">
													({{
														primaryWork != null && primaryWork?.count > 0 ? primaryWork?.count : 0
													}})
												</span>
											</div>
										</div>
									</AccordionTrigger>
								</div>
								<AccordionContent>
									<div
										v-if="primaryWork && primaryWork.children && primaryWork.children.length > 0"
										class="flex text-sm font-normal"
									>
										<fieldset class="flex w-full flex-col">
											<legend class="sr-only">Werktyp | Primärliteratur</legend>
											<div v-for="work in primaryWork.children" :key="work.id" class="pb-1">
												<div class="grid grid-cols-[auto_1fr] items-center pb-1">
													<input
														:id="`workType` + work.id"
														:checked="
															(checkedFacets.workType
																? checkedFacets.workType.includes(work.key)
																: false) || selectedCheckboxes.includes(work.key)
														"
														class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
														name="workType"
														type="checkbox"
														:value="work.key"
														@change="toggleWork(work.key as unknown as string, work.children ?? [])"
													/>
													<div>
														<label class="pl-2 font-medium" :for="`workType` + work.id">
															{{ work.key }}
														</label>
														<span class="pl-1 text-frisch-grey">({{ work.count }})</span>
													</div>
												</div>
												<div v-if="work.children && work.children.length > 0">
													<div v-for="subwork in work.children" :key="subwork.id">
														<div class="grid grid-cols-[auto_1fr] items-center pl-5">
															<input
																:id="`workType` + subwork.id"
																:checked="
																	(checkedFacets.workType
																		? checkedFacets.workType.includes(subwork.key)
																		: false) || selectedCheckboxes.includes(subwork.key)
																"
																class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
																name="workType"
																type="checkbox"
																:value="subwork.key"
																@change="toggleSubterm(subwork.key as unknown as string)"
															/>
															<div>
																<label class="pl-2" :for="`workType` + subwork.id">
																	{{ subwork.key }}
																</label>
																<span class="pl-1 text-frisch-grey">({{ subwork.count }})</span>
															</div>
														</div>
													</div>
												</div>
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
						<Accordion collapsible default-value="work_type_primary" type="single">
							<AccordionItem value="work_type_primary">
								<div
									:class="
										secondaryWork != null && secondaryWork.count > 0
											? `grid grid-cols-[auto_1fr] items-center gap-2`
											: `grid w-full items-center`
									"
								>
									<div v-if="secondaryWork != null">
										<input
											:id="`workType` + secondaryWork.id"
											:checked="
												(checkedFacets.workType
													? checkedFacets.workType.includes(secondaryWork.key)
													: false) || selectedCheckboxes.includes(secondaryWork.key)
											"
											class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
											name="workType"
											type="checkbox"
											:value="secondaryWork.key"
											@change="
												toggleWork(
													secondaryWork.key as unknown as string,
													secondaryWork.children ?? [],
												)
											"
										/>
										<label class="sr-only pl-2 font-medium" :for="`workType` + secondaryWork.id">
											{{ secondaryWork.key }}
										</label>
									</div>
									<AccordionTrigger>
										<div class="flex w-full items-center gap-2">
											<div class="text-lg">
												Sekundärlitertur / Rezeption
												<span class="text-sm text-frisch-grey">
													({{
														secondaryWork != null && secondaryWork?.count > 0
															? secondaryWork?.count
															: 0
													}})
												</span>
											</div>
										</div>
									</AccordionTrigger>
								</div>
								<AccordionContent>
									<div
										v-if="
											secondaryWork && secondaryWork.children && secondaryWork.children.length > 0
										"
										class="flex text-sm font-normal"
									>
										<fieldset class="flex w-full flex-col">
											<legend class="sr-only">Werktyp | Sekundärliteratur / Rezeption</legend>
											<div v-for="work in secondaryWork.children" :key="work.id" class="pb-1">
												<div class="grid grid-cols-[auto_1fr] items-center pb-1">
													<input
														:id="`workType` + work.id"
														:checked="
															(checkedFacets.workType
																? checkedFacets.workType.includes(work.key)
																: false) || selectedCheckboxes.includes(work.key)
														"
														class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
														name="workType"
														type="checkbox"
														:value="work.key"
														@change="toggleWork(work.key as unknown as string, work.children ?? [])"
													/>
													<div>
														<label class="pl-2 font-medium" :for="`workType` + work.id">
															{{ work.key }}
														</label>
														<span class="pl-1 text-frisch-grey">({{ work.count }})</span>
													</div>
												</div>
												<div v-if="work.children && work.children.length > 0">
													<div v-for="subwork in work.children" :key="subwork.id">
														<div class="grid grid-cols-[auto_1fr] items-center pl-5">
															<input
																:id="`workType` + subwork.id"
																:checked="
																	(checkedFacets.workType
																		? checkedFacets.workType.includes(subwork.key)
																		: false) || selectedCheckboxes.includes(subwork.key)
																"
																class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
																name="workType"
																type="checkbox"
																:value="subwork.key"
																@change="toggleSubterm(subwork.key as unknown as string)"
															/>
															<div>
																<div>
																	<label class="pl-2" :for="`workType` + subwork.id">
																		{{ subwork.key }}
																	</label>
																	<span class="pl-1 text-frisch-grey">({{ subwork.count }})</span>
																</div>
															</div>
														</div>
													</div>
												</div>
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
						<Accordion
							collapsible
							type="single"
							@update:model-value="
								resetSlider();
								addCheckbox('year');
							"
						>
							<AccordionItem v-model:open="yearChecked" value="year">
								<AccordionTrigger
									class="grid w-full grid-cols-[auto_auto_1fr] place-items-end items-center gap-2"
								>
									<div>
										<input
											id="year"
											:checked="yearChecked"
											class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
											name="year"
											type="checkbox"
										/>
									</div>
									<div class="text-lg">Erscheinungsjahr</div>
								</AccordionTrigger>
								<AccordionContent>
									<div class="w-full text-sm font-normal">
										<div class="grid w-full grid-cols-[1fr_auto] pb-4">
											<div>{{ sliderValue[0] }}</div>
											<input name="startYear" type="hidden" :value="sliderValue[0]" />
											<div>{{ sliderValue[1] }}</div>
											<input name="endYear" type="hidden" :value="sliderValue[1]" />
										</div>
										<Slider
											v-model="sliderValue"
											class="pb-3"
											:max="slider.max"
											:min="slider.min"
											:step="1"
											@update:model-value="onSliderChange"
										/>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<Separator class="bg-frisch-orange"></Separator>
					</div>
					<div class="pb-4">
						<Accordion collapsible default-value="language" type="single">
							<AccordionItem value="language">
								<AccordionTrigger>
									<div class="text-lg">Sprache</div>
								</AccordionTrigger>
								<AccordionContent>
									<div
										v-if="props.facets?.language && props.facets?.language.length > 0"
										class="text-sm font-normal"
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
														:checked="
															checkedFacets.language
																? checkedFacets.language.includes(item.key!)
																: false
														"
														class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
														name="language"
														type="checkbox"
														:value="item.key"
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
						<Accordion collapsible default-value="topic" type="single">
							<AccordionItem value="topic">
								<AccordionTrigger>
									<div class="text-lg">Thema</div>
								</AccordionTrigger>
								<AccordionContent>
									<div v-if="sortedTopics && sortedTopics.length > 0" class="text-sm font-normal">
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
														:checked="
															checkedFacets.topic ? checkedFacets.topic.includes(item.key!) : false
														"
														class="size-4 appearance-none border border-frisch-orange bg-white checked:appearance-auto checked:accent-frisch-orange"
														name="topic"
														type="checkbox"
														:value="item.key"
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
										class="p-0 pb-2 text-sm font-medium"
										type="button"
										variant="searchform"
										@click="toggleShowMore"
									>
										{{ showMore ? `Weniger anzeigen` : `Mehr anzeigen ...` }}
									</Button>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<Separator class="bg-frisch-orange"></Separator>
						<div
							v-if="isCheckBoxActive || hasSliderChanged"
							class="flex w-full justify-end pt-4 text-sm"
						>
							<Button type="submit" variant="frischMarine">Filter anwenden</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
