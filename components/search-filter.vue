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

const slider = { min: 1941, max: 2025 };
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

const allWorkTypes = computed(() => {
	if (
		primaryWork.value &&
		primaryWork.value.children &&
		secondaryWork.value &&
		secondaryWork.value.children
	) {
		const tempArray = [...primaryWork.value.children, ...secondaryWork.value.children];

		return tempArray;
	}
	return [];
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
const hasSliderChanged = ref(false);
const isCheckBoxActive = ref(false);

watch(
	checkedFacets,
	() => {
		console.log("checkedFacets: ", checkedFacets);
		selectedCheckboxes.value = [];
		isCheckBoxActive.value = false;

		if (checkedFacets.value.workType.length > 0) {
			selectedCheckboxes.value.push(...checkedFacets.value.workType);
		}

		hasSliderChanged.value = false;
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
	if (selectedCheckboxes.value.length > 0) {
		isCheckBoxActive.value = true;
	} else isCheckBoxActive.value = false;
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
	hasSliderChanged.value = false;
	isCheckBoxActive.value = false;
}

function findParentByChildKey(childKey: string, nodes: Array<workType> | null): workType | null {
	if (!nodes) return null;
	for (const node of nodes) {
		if (node.children && node.children.some((child) => child.key === childKey)) {
			return node;
		}
		if (node.children) {
			const found = findParentByChildKey(childKey, node.children);
			if (found) return found;
		}
	}
	return null;
}

function areAllChildrenChecked(children: Array<workType> | null): boolean {
	if (!children || children.length === 0) return true;
	return children.every(
		(child) =>
			selectedCheckboxes.value.includes(child.key) && areAllChildrenChecked(child.children),
	);
}

function updateParentState(childKey: string) {
	// Try finding parent in primaryWork tree first, then secondaryWork
	const parent = findParentByChildKey(childKey, allWorkTypes.value);
	if (!parent) {
		// Check if childKey belongs to primaryWork subtree
		if (allWorkTypes.value && isChildOfRoot(childKey, parent)) {
			// If *any* child of primaryWork is unchecked, untick the root "Primärwerk"
			const allSelected = areAllChildrenChecked(allWorkTypes.value);
			updateSelectedCheckboxes("Primärwerk", allSelected);
		}

		return; // done updating root state
	}

	// Check if all children of this parent are selected
	const allChildrenSelected = areAllChildrenChecked(parent.children);

	// Update parent checkbox state accordingly
	updateSelectedCheckboxes(parent.key, allChildrenSelected);

	// Recursively update higher level parents, if any
	updateParentState(parent.key);
}

function toggleWork(key: string, subterms: Array<workType>) {
	const isCurrentlyChecked = selectedCheckboxes.value.includes(key);
	const shouldBeChecked = !isCurrentlyChecked;

	const allChildKeys = collectAllKeys(subterms);

	updateSelectedCheckboxes(key, shouldBeChecked);

	allChildKeys.forEach((childKey) => {
		updateSelectedCheckboxes(childKey, shouldBeChecked);
	});
	updateParentState(key);
}

function collectAllKeys(items: Array<workType>): Array<string> {
	return items.flatMap((item) => {
		const childrenKeys = item.children ? collectAllKeys(item.children) : [];
		return [item.key, ...childrenKeys];
	});
}

function toggleSubterm(key: string) {
	// const isChecked = selectedCheckboxes.value.includes(key);
	// updateSelectedCheckboxes(key, !isChecked);

	const isChecked = selectedCheckboxes.value.includes(key);
	updateSelectedCheckboxes(key, !isChecked);

	// Find parent in both primary and secondary trees
	let parent = findParentByChildKey(key, primaryWork.value?.children || null);
	if (!parent) {
		parent = findParentByChildKey(key, secondaryWork.value?.children || null);
	}

	if (parent) {
		const allChildrenSelected = areAllChildrenChecked(parent.children);
		updateSelectedCheckboxes(parent.key, allChildrenSelected);
		updateParentState(parent.key); // Recursively update upwards if needed
	} else {
		// If no parent found, might be a root-level child
		// Check if key belongs under Primärwerk or Sekundärwerk root
		if (isChildOfRoot(key, primaryWork.value)) {
			updateRootState("Primärwerk", primaryWork.value);
		}
		if (isChildOfRoot(key, secondaryWork.value)) {
			updateRootState("Rezeption/Sekundärwerk", secondaryWork.value);
		}
	}
}

function anyChildChecked(rootNode: workType | null): boolean {
	if (!rootNode || !rootNode.children) return false;

	// Recursive search
	function search(children: Array<workType>): boolean {
		return children.some((child) => {
			if (selectedCheckboxes.value.includes(child.key)) return true;
			if (child.children) return search(child.children);
			return false;
		});
	}

	return search(rootNode.children);
}

function isChildOfRoot(childKey: string, rootNode: workType | null): boolean {
	if (!rootNode || !rootNode.children) return false;

	// Recursively check if childKey exists somewhere under rootNode.children
	function search(children: Array<workType>): boolean {
		for (const child of children) {
			if (child.key === childKey) return true;
			if (child.children && search(child.children)) return true;
		}
		return false;
	}

	return search(rootNode.children);
}

function updateRootState(rootKey: string, rootNode: workType | null) {
	if (!rootNode || !rootNode.children) return;

	const allChildrenSelected = areAllChildrenChecked(rootNode.children);

	updateSelectedCheckboxes(rootKey, allChildrenSelected);
}

function updateSelectedCheckboxes(id: string, isChecked: boolean) {
	if (isChecked) {
		selectedCheckboxes.value = Array.from(new Set([...selectedCheckboxes.value, id]));
	} else {
		selectedCheckboxes.value = selectedCheckboxes.value.filter((v) => v !== id);
	}
	if (selectedCheckboxes.value.length > 0) {
		isCheckBoxActive.value = true;
	} else isCheckBoxActive.value = false;
}

watch(
	selectedCheckboxes,
	(val) => {
		console.log("Updated checkboxes:", val);
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<div class="relative px-6">
		<div class="relative bg-frisch-orange-super-light p-6">
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
					<Accordion collapsible default-value="work_type" type="single">
						<AccordionItem value="work_type">
							<AccordionTrigger>
								<div class="text-lg">Werktyp</div>
							</AccordionTrigger>
							<AccordionContent>
								<div
									v-if="allWorkTypes && allWorkTypes.length > 0"
									class="flex text-sm font-normal"
								>
									<fieldset class="flex w-full flex-col">
										<legend class="sr-only">Werktyp</legend>
										<div v-for="work in allWorkTypes" :key="work.id" class="pb-1">
											<div class="grid grid-cols-[auto_1fr] items-center pb-1">
												<input
													:id="`workType` + work.id"
													:checked="selectedCheckboxes.includes(work.key)"
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
															:checked="selectedCheckboxes.includes(subwork.key)"
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
				</div>
			</div>
		</div>
	</div>
	<div
		class="absolute bottom-20 left-1/2 z-50 justify-center transition md:left-auto md:right-40 md:pr-5"
	>
		<div
			class="fixed -translate-x-1/2 justify-end pt-4 text-sm transition md:translate-x-0"
			:class="
				isCheckBoxActive || hasSliderChanged
					? 'opacity-100 translate-y-0'
					: 'opacity-0 translate-y-5 pointer-events-none'
			"
		>
			<Button type="submit" variant="frischMarine">Filter anwenden</Button>
		</div>
	</div>
</template>
