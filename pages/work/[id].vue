<script lang="ts" setup>
import { GlobeIcon } from "lucide-vue-next";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const route = useRoute();

const id = computed(() => {
	return Number(route.params.id as string);
});

const { data, isPending, isPlaceholderData } = useGetWork(
	computed(() => {
		return id.value;
	}),
);

const work = computed(() => {
	return data.value;
});

const isLoading = computed(() => {
	return isPending.value || isPlaceholderData.value;
});

const characters = computed(() => {
	return {
		main: work.value?.characters
			?.filter((character) => character.relevancy === "Hauptfigur")
			.map((character) => character.fallback_name),
		secondary: work.value?.characters
			?.filter((character) => character.relevancy === "Nebenfigur")
			.map((character) => character.fallback_name),
		spokenOf: work.value?.characters
			?.filter((character) => character.relevancy === "erwähnte Figur")
			.map((character) => character.fallback_name),
	};
});

const places = computed(() => {
	return {
		mentioned: work.value?.places
			?.filter((place) => place.relation_type === "mentions")
			.map((place) => place.name),
		takesPlaceIn: work.value?.places
			?.filter((place) => place.relation_type === "takes place in")
			.map((place) => place.name),
	};
});

const relatedWork = computed(() => {
	return {
		referencedIn: work.value?.related_works
			?.filter((relation) => relation.relation_type === "is referenced in")
			.map((relation) => relation.title),
		references: work.value?.related_works
			?.filter((relation) => relation.relation_type === "references")
			.map((relation) => relation.title),
	};
});

const icon = computed(() => {
	if (work.value?.work_type?.[0]?.name != null) {
		return getWorkIcon(work.value.work_type[0]?.name);
	}
	return null;
});
</script>

<template>
	<MainContent class="relative grid h-full bg-frisch-marine pr-20">
		<div v-if="!isLoading" class="grid h-full grid-cols-[auto_1fr]">
			<div
				class="size-0 border-y-[85px] border-l-[85px] border-y-transparent border-l-frisch-orange"
			/>
			<div class="grid grid-cols-2 gap-8">
				<div v-if="work != null" class="bg-white p-16">
					<div v-if="work?.work_type != null" class="flex items-center gap-2 pb-2">
						<component :is="icon" :size="20" />
						{{ work?.work_type[0]?.name }}
					</div>
					<div class="pb-2">
						<div class="text-xl font-semibold">
							{{ work?.title }}
						</div>
						<div v-if="work?.subtitle" class="italic">
							{{ work?.subtitle }}
						</div>
					</div>
					<div v-if="work?.expression_data != null" class="pb-2">
						<div class="pb-2">
							<span v-for="(entry, index) in work.expression_data" :key="index">
								<span>{{ entry?.edition_type?.[0] || "" }}</span>
								<span v-if="entry.edition_type?.[0]">{{ ", " }}</span>
								<span>{{ entry?.place_of_publication?.[0]?.name || "" }}</span>
								<span v-if="entry?.place_of_publication?.[0]?.name">{{ ": " }}</span>
								{{ entry?.publisher?.name || "" }}
								<span>{{ entry?.publication_date?.split("-")?.[0] || "" }}</span>
								<span v-if="entry?.publication_date">.</span>
								<span v-if="index !== work?.expression_data.length - 1">{{ " | " }}</span>
							</span>
						</div>

						<div v-if="work?.expression_data[0]?.language != null" class="flex items-center">
							<GlobeIcon :size="16" class="mr-2" />
							<div v-for="(language, index) in work?.expression_data[0]?.language" :key="language">
								<span>{{ language }}</span>
								<span v-if="index !== work?.expression_data[0]?.language.length - 1">
									{{ ", " }}&nbsp;
								</span>
							</div>
						</div>
					</div>
					<span v-for="topic in work?.topics" :key="topic" class="mb-2 mr-1">
						<div class="mb-1 inline-block bg-frisch-grey px-2 py-1 text-xs text-white opacity-85">
							{{ topic.name }}
						</div>
					</span>
					<Separator class="my-4 h-[3px] bg-frisch-marine"></Separator>
					<div class="py-2 text-lg font-semibold">Zusammenfassung</div>
					<div v-if="work?.summary">
						{{ work?.summary }}
					</div>
					<div v-else>Keine Zusammenfassung vorhanden.</div>
					<Accordion type="single" class="font-normal" collapsible>
						<AccordionItem value="context">
							<AccordionTrigger>
								<div class="text-lg font-semibold">Kontexte</div>
							</AccordionTrigger>
							<AccordionContent class="text-base">
								<div v-if="work?.context">
									{{ work?.context }}
								</div>
								<div v-else>Keine Kontexte vorhanden.</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<div>
						<Accordion type="single" collapsible>
							<AccordionItem value="characters">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Charaktere</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<!-- TODO: display fictionality -->
									<div class="grid grid-cols-3 gap-4">
										<div>
											<div class="pb-2 font-semibold">Hauptfiguren</div>
											<div v-if="characters.main.length > 0">
												<div v-for="character in characters.main" :key="character">
													{{ character }}
												</div>
											</div>
											<div v-else>Keine Hauptfiguren vorhanden.</div>
										</div>
										<div>
											<div class="pb-2 font-semibold">Nebenfiguren</div>
											<div v-if="characters.secondary.length > 0">
												<div v-for="character in characters.secondary" :key="character">
													{{ character }}
												</div>
											</div>
											<div v-else>Keine Nebenfiguren vorhanden.</div>
										</div>
										<div>
											<div class="pb-2 font-semibold">Erwähnte Figuren</div>
											<div v-if="characters.spokenOf.length > 0">
												<div v-for="character in characters.spokenOf" :key="character">
													{{ character }}
												</div>
											</div>
											<div v-else>Keine erwähnten Figuren vorhanden.</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div>
						<Accordion type="single" collapsible>
							<AccordionItem value="places">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Orte</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div>
										<div class="grid grid-cols-2 gap-4">
											<div>
												<div class="pb-2 font-semibold">Schauplätze</div>
												<div v-if="places.takesPlaceIn.length > 0">
													<div v-for="place in places.takesPlaceIn" :key="place">
														{{ place }}
													</div>
												</div>
												<div v-else>Keine Schauplätze vorhanden.</div>
											</div>
											<div>
												<div class="pb-2 font-semibold">Erwähnte Orte</div>
												<div v-if="places.mentioned.length > 0">
													<div v-for="place in places.mentioned" :key="place">
														{{ place }}
													</div>
												</div>
												<div v-else>Keine erwähnten Orte vorhanden.</div>
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div>
						<Accordion type="single" collapsible>
							<AccordionItem value="relations">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Bezüge</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div>
										<div class="grid grid-cols-2 gap-4">
											<div>
												<div class="pb-2 font-semibold">Erwähnte Werke</div>
												<div v-if="relatedWork.references.length > 0">
													<div v-for="relation in relatedWork.references" :key="relation">
														{{ relation }}
													</div>
												</div>
												<div v-else>Keine Bezüge vorhanden.</div>
											</div>
											<div>
												<div class="pb-2 font-semibold">Wurde erwähnt in</div>
												<div v-if="relatedWork.referencedIn.length > 0">
													<div v-for="relation in relatedWork.referencedIn" :key="relation">
														{{ relation }}
													</div>
												</div>
												<div v-else>Keine Bezüge vorhanden.</div>
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
				<div class="bg-white py-8">
					<div class="grid grid-cols-[auto_1fr] items-center gap-4">
						<div
							class="size-0 border-y-[55px] border-l-[55px] border-y-transparent border-l-frisch-marine"
						/>
						<div class="py-2 text-lg font-semibold">Narratologische Analyse</div>
					</div>
					<div class="block px-16">
						<div v-if="work?.text_analysis">
							{{ work?.text_analysis }}
						</div>
						<div v-else>Keine narrotologische Analyse vorhanden.</div>
					</div>
				</div>
			</div>
		</div>
		<Centered v-else class="pointer-events-none">
			<LoadingSpinner />
		</Centered>
	</MainContent>
</template>
