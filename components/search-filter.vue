<script lang="ts" setup>
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { SearchFacets } from "@/types/api";

const route = useRoute();

const checkedFacets: {
	language: string;
	topic: string;
} = computed(() => {
	return { language: route.query.language, topic: route.query.topic };
});

const props = defineProps<{
	facets: SearchFacets;
}>();

const sortedTopics = computed(() => {
	if (props.facets?.topic != null) {
		const temp = [...props.facets.topic];
		return temp.sort((a, b) => {
			return Number(b.count) - Number(a.count);
		});
	}
	return null;
});

const showTopics = ref(false);

function showMoreTopics() {
	if (showTopics.value) {
		showTopics.value = false;
	} else showTopics.value = true;
}

const slider = { min: 1940, max: 2024 };
const sliderValue = ref([slider.min, slider.max]);
</script>

<template>
	<div class="px-6">
		<div class="bg-frisch-orange-super-light p-6">
			<div class="text-lg font-medium text-frisch-orange">
				<div class="pb-4">
					<div class="pb-2 text-xl">Filterung</div>
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
									class="grid grid-cols-2 py-3 text-sm font-normal"
								>
									<div
										v-for="(item, index) in props.facets?.language"
										:key="index"
										class="flex w-full flex-col"
									>
										<div class="flex items-center">
											<Checkbox
												:id="`language${index}`"
												name="language"
												:value="item.key"
												type="checkbox"
												:default-checked="
													checkedFacets.language ? checkedFacets.language.includes(item.key) : false
												"
											/>
											<label :for="`language${index}`" class="pl-2">{{ item.key }}</label>
											<span class="pl-1 text-frisch-grey">({{ item.count }})</span>
										</div>
									</div>
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
							<AccordionContent v-if="!showTopics">
								<div
									v-if="sortedTopics && sortedTopics.length > 0"
									class="grid grid-cols-2 py-3 text-sm font-normal"
								>
									<div
										v-for="(item, index) in sortedTopics?.slice(0, 10)"
										:key="item.key"
										class="flex w-full flex-col"
									>
										<div class="flex w-full">
											<Checkbox
												:id="`topic${index}`"
												:value="item.key"
												name="topic"
												type="checkbox"
												:default-checked="
													checkedFacets.topic ? checkedFacets.topic.includes(item.key) : false
												"
											/>
											<div class="items-center pl-2">
												<label :for="`topic${index}`">{{ item.key }}</label>
												<span class="pl-1 text-frisch-grey">({{ item.count }})</span>
											</div>
										</div>
									</div>
								</div>
								<div v-else class="py-3 text-frisch-grey">
									Keine weiteren Filtermöglichkeiten vorhanden.
								</div>
								<Button
									v-if="sortedTopics && sortedTopics.length > 10"
									variant="searchform"
									class="p-0 pb-2 text-sm font-medium"
									@click="showMoreTopics"
								>
									Mehr anzeigen ...
								</Button>
							</AccordionContent>
							<AccordionContent v-else>
								<div class="grid grid-cols-2 overflow-hidden py-3 text-sm font-normal">
									<div
										v-for="(item, index) in sortedTopics"
										:key="item.key"
										class="flex w-full flex-col"
									>
										<div class="flex w-full">
											<Checkbox
												:id="`topic${index}`"
												:value="item.key"
												name="topic"
												type="checkbox"
												:default-checked="
													checkedFacets.topic ? checkedFacets.topic.includes(item.key) : false
												"
											/>
											<div class="items-center pl-2">
												<label :for="`topic${index}`">{{ item.key }}</label>
												<span class="pl-1 text-frisch-grey">({{ item.count }})</span>
											</div>
										</div>
									</div>
								</div>
								<Button
									variant="searchform"
									class="p-0 pb-2 text-sm font-medium"
									@click="showMoreTopics"
								>
									Weniger anzeigen ...
								</Button>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Separator class="bg-frisch-orange"></Separator>
				</div>
			</div>
		</div>
	</div>
</template>
