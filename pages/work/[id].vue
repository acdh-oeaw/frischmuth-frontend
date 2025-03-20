<script lang="ts" setup>
import { EyeIcon, GlobeIcon } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const isOpenPlace = ref(false);
const isOpenCharacter = ref(false);
const currentRelation = ref("");
const currentMetaId = ref<number | null>(null);

const isMobile = computed(() => {
	return window.innerWidth < 820;
});

const isTablet = computed(() => {
	return window.innerWidth < 1536;
});

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
			.map((character) => {
				const fictionality = character.fictionality ? character.fictionality[0] : "";
				return {
					id: character.id,
					name: character.fallback_name,
					fictionality: fictionality,
					metacharacterId: character.metacharacter ? character.metacharacter.id : null,
				};
			}),
		secondary: work.value?.characters
			?.filter((character) => character.relevancy === "Nebenfigur")
			.map((character) => {
				const fictionality = character.fictionality ? character.fictionality[0] : "";
				return {
					id: character.id,
					name: character.fallback_name,
					fictionality: fictionality,
					metacharacterId: character.metacharacter ? character.metacharacter.id : null,
				};
			}),
		spokenOf: work.value?.characters
			?.filter((character) => character.relevancy === "erwähnte Figur")
			.map((character) => {
				const fictionality = character.fictionality ? character.fictionality[0] : "";
				return {
					id: character.id,
					name: character.fallback_name,
					fictionality: fictionality,
					metacharacterId: character.metacharacter ? character.metacharacter.id : null,
				};
			}),
	};
});

const places = computed(() => {
	return {
		mentioned: work.value?.places
			?.filter((place) => place.relation_type === "mentions")
			.map((place) => ({
				id: place.id,
				name: place.name,
				longitude: place.longitude,
				latitude: place.latitude,
				description: place.description,
			})),
		discussed: work.value?.places
			?.filter((place) => place.relation_type === "discusses")
			.map((place) => ({
				id: place.id,
				name: place.name,
				longitude: place.longitude,
				latitude: place.latitude,
				description: place.description,
			})),
		takesPlaceIn: work.value?.places
			?.filter((place) => place.relation_type === "takes place in")
			.map((place) => ({
				id: place.id,
				name: place.name,
				longitude: place.longitude,
				latitude: place.latitude,
				description: place.description,
			})),
	};
});

const relatedWork = computed(() => {
	return {
		referencedIn: work.value?.related_works
			?.filter((relation) => relation.relation_type === "is referenced in")
			.map((relation) => ({
				id: relation.id,
				title: relation.title,
			})),
		references: work.value?.related_works
			?.filter((relation) => relation.relation_type === "references")
			.map((relation) => ({
				id: relation.id,
				title: relation.title,
			})),
		discussedIn: work.value?.related_works
			?.filter((relation) => relation.relation_type === "is discussed in")
			.map((relation) => ({
				id: relation.id,
				title: relation.title,
			})),
	};
});

const analysisTags = computed(() => {
	return [
		{ name: "Zeitliche Ordnung", value: work.value?.temporal_order?.[0] },
		{ name: "Zeitliche Dauer", value: work.value?.temporal_duration?.[0] },
		{ name: "Zeitliche Häufigkeit", value: work.value?.temporal_frequency?.[0] },
		{ name: "Stilfigur", value: work.value?.figure_speech?.[0] },
		{ name: "Fokalisierung", value: work.value?.focalization?.[0] },
		{ name: "Narrative Situation", value: work.value?.narrative_situation?.[0] },
		{ name: "Narrative Chronologie", value: work.value?.narrative_chronology?.[0] },
		{ name: "Narrative Ebene", value: work.value?.narrative_level?.[0] },
		{ name: "Narrative Stimme", value: work.value?.narrative_voice?.[0] },
	].filter((item) => item.value !== undefined);
});

const icon = computed(() => {
	if (work.value?.work_type?.[0]?.name != null) {
		return getWorkIcon(work.value.work_type[0]?.name);
	}
	return null;
});

const persons = computed(() => {
	const authors: Array<string> = [];
	const editors: Array<string> = [];

	work.value?.persons?.forEach((person) => {
		const name = `${person.forename} ${person.surname}`;

		if (person.relation_type === "has author") {
			authors.push(name);
		} else if (person.relation_type === "has editor") {
			editors.push(name);
		}
	});

	const formattedAuthors = authors.join(", ");
	const formattedEditors = editors.join(", ");

	if (formattedAuthors && formattedEditors) {
		return `${formattedAuthors} | ${formattedEditors}`;
	} else if (formattedAuthors) {
		return formattedAuthors;
	} else if (formattedEditors) {
		return formattedEditors;
	}
	return "";
});

function closeSidebar() {
	isOpenPlace.value = false;
	isOpenCharacter.value = false;

	void router.replace({
		query: { ...route.query, place: undefined, character: undefined },
	});
}

function setQueryAndRelation(dataType: string, id: number | undefined, relation: string) {
	closeSidebar();
	if (id != null) {
		if (dataType === "Ort") {
			void router.push({
				query: { place: id },
			});
			isOpenPlace.value = true;
		} else {
			void router.push({
				query: { character: id },
			});
			isOpenCharacter.value = true;
		}

		currentRelation.value = relation;
	}
}
const metadataPersons = computed(() => {
	const authors: Array<{ forename: string; surname: string }> = [];

	work.value?.persons?.forEach((person) => {
		if (person.relation_type === "has author") {
			authors.push({ forename: person.forename ?? "", surname: person.surname ?? "" });
		}
	});
	return authors;
});
function setMetaId(id: number | null) {
	currentMetaId.value = id;
}
</script>

<template>
	<MainContent class="relative grid h-full bg-frisch-marine md:pr-14 2xl:pr-20">
		<div v-if="!isLoading" class="grid h-full md:grid-cols-[auto_1fr]">
			<div
				class="hidden size-0 border-y-[85px] border-l-[85px] border-y-transparent border-l-frisch-orange md:block md:border-y-[65px] md:border-l-[65px]"
			/>
			<div class="grid md:grid-cols-2 md:gap-8">
				<div v-if="work != null" class="bg-white p-8 lg:p-16">
					<div class="grid w-full grid-cols-2 items-center pb-2">
						<div v-if="work?.work_type != null && icon" class="flex items-center gap-2">
							<component :is="icon.icon" :size="20" />
							{{ work?.work_type[0]?.name }}
						</div>
						<CitationButton
							class="place-self-end"
							:metadata="[work?.expression_data]"
							:persons="metadataPersons ?? []"
						/>
					</div>
					<div v-if="persons" class="italic">
						{{ persons }}
					</div>
					<div class="pb-2">
						<div class="text-xl font-semibold">
							{{ work?.title }}
						</div>
						<div v-if="work?.subtitle">
							{{ work?.subtitle }}
						</div>
					</div>
					<div v-if="work?.expression_data != null" class="pb-2 text-sm">
						<div class="pb-1">
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

						<div class="flex items-center">
							<GlobeIcon class="mr-2" :size="16" />
							<div
								v-if="
									work?.expression_data[0]?.language != null &&
									work?.expression_data[0]?.language.length > 0
								"
							>
								<div class="w-full">
									<span v-if="work?.expression_data[0]?.language?.length">
										{{ work.expression_data[0].language.join(", ") }}
									</span>
								</div>
							</div>
							<div v-else>Deutsch</div>
						</div>
					</div>
					<span v-for="topic in work?.topics" :key="topic.id" class="mb-2 mr-1">
						<div class="mb-1 inline-block bg-frisch-indigo px-2 py-1 text-xs text-white opacity-85">
							<NuxtLink
								:href="{
									path: `/search`,
									query: {
										topic: topic.name,
									},
								}"
							>
								{{ topic.name }}
							</NuxtLink>
						</div>
					</span>
					<div class="block md:hidden">
						<Drawer>
							<DrawerTrigger class="w-full">
								<span class="grid grid-cols-[auto_1fr] items-center gap-2 pt-2 text-frisch-orange">
									<EyeIcon :size="16" />
									<span class="flex justify-start font-semibold">Analyse</span>
								</span>
								<!-- Behaviour needs review
								<span
									v-else
									class="grid grid-cols-[auto_1fr] items-center gap-2 pt-2 text-muted-foreground"
								>
									<EyeOffIcon :size="16" />
									<span class="flex justify-start font-semibold">
										Keine narrotologische Analyse vorhanden.
									</span>
								</span>
								 -->
							</DrawerTrigger>
							<DrawerContent>
								<div class="overflow-auto bg-white py-8">
									<div class="grid grid-cols-[auto_1fr] items-center gap-4">
										<div
											class="size-0 border-y-[55px] border-l-[55px] border-y-transparent border-l-frisch-marine"
										/>
										<div class="py-2 text-lg font-semibold">Analyse</div>
									</div>
									<div class="block hyphens-auto px-8 text-justify lg:px-16">
										<div v-if="work?.text_analysis">
											{{ work?.text_analysis }}
										</div>
										<div v-else class="text-sm text-muted-foreground">Keine Analyse vorhanden.</div>
										<div v-if="analysisTags.length > 0" class="py-4">
											<span v-for="tag in analysisTags" :key="tag.name" class="mb-2 mr-1">
												<Popover>
													<PopoverTrigger>
														<span
															class="mb-1 inline-block cursor-default bg-frisch-orange px-2 py-1 text-xs text-white opacity-85"
														>
															{{ tag.value }}
														</span>
													</PopoverTrigger>
													<PopoverContent>
														{{ tag.name }}
													</PopoverContent>
												</Popover>
											</span>
										</div>
									</div>
								</div>
							</DrawerContent>
						</Drawer>
					</div>
					<Separator class="my-4 h-[3px] bg-frisch-marine"></Separator>
					<div class="py-2 text-lg font-semibold">Zusammenfassung</div>
					<div v-if="work?.summary" class="block hyphens-auto text-justify">
						{{ work?.summary }}
					</div>
					<div v-else class="text-sm text-muted-foreground">Keine Zusammenfassung vorhanden.</div>
					<Accordion
						:key="work?.id"
						:class="
							work?.context || work?.historical_events
								? `font-normal`
								: `font-normal text-frisch-grey`
						"
						collapsible
						:disabled="work?.context || work?.historical_events ? false : true"
						type="single"
					>
						<AccordionItem value="context">
							<AccordionTrigger>
								<div class="text-lg font-semibold">Kontexte</div>
							</AccordionTrigger>
							<AccordionContent class="text-base">
								<div v-if="work?.context || work?.historical_events">
									<div class="pb-1">
										{{ work?.context }}
									</div>
									<div v-if="work?.historical_events">
										<span class="font-semibold">Historische Events:&nbsp;</span>
										<span>{{ work?.historical_events }}</span>
									</div>
								</div>
								<div v-else class="text-sm text-muted-foreground">Keine Kontexte vorhanden.</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<div>
						<Accordion
							:key="work?.id"
							:class="
								(characters.main && characters.main?.length > 0) ||
								(characters.secondary && characters.secondary?.length > 0) ||
								(characters.spokenOf && characters.spokenOf?.length > 0)
									? `font-normal`
									: `font-normal text-frisch-grey`
							"
							collapsible
							:disabled="
								(characters.main && characters.main?.length > 0) ||
								(characters.secondary && characters.secondary?.length > 0) ||
								(characters.spokenOf && characters.spokenOf?.length > 0)
									? false
									: true
							"
							type="single"
						>
							<AccordionItem value="characters">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Charaktere</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div class="grid grid-rows-[auto_auto_auto] gap-4 2xl:grid-cols-3">
										<div>
											<div class="pb-2 font-semibold">Hauptfiguren</div>
											<div v-if="characters.main != null && characters.main.length > 0">
												<div v-for="character in characters.main" :key="character.name">
													<span v-if="character.fictionality" class="flex items-center gap-1">
														<CharacterFictionality
															:fictionality="character.fictionality"
															:is-detail-view="false"
															:is-mobile="isMobile"
															:is-tablet="isTablet"
														/>
														<CharacterFictionality
															v-if="character.metacharacterId != null"
															fictionality="Metacharakter"
															:is-detail-view="false"
															:is-mobile="isMobile"
															:is-tablet="isTablet"
														/>

														<Button
															class="flex cursor-pointer items-center p-0 text-base font-normal underline decoration-dotted hover:no-underline"
															variant="transparent"
															@click="
																setQueryAndRelation('Charakter', character.id, 'Hauptfigur');
																setMetaId(character.metacharacterId);
															"
														>
															{{ character.name }}
															<span class="sr-only">Charakter anzeigen</span>
														</Button>
													</span>
												</div>
											</div>
											<div v-else class="text-sm text-muted-foreground">
												Keine Hauptfiguren vorhanden.
											</div>
										</div>
										<div>
											<div class="pb-2 font-semibold">Nebenfiguren</div>
											<div v-if="characters.secondary != null && characters.secondary.length > 0">
												<div v-for="character in characters.secondary" :key="character.name">
													<span v-if="character.fictionality" class="flex items-center gap-1">
														<CharacterFictionality
															:fictionality="character.fictionality"
															:is-detail-view="false"
															:is-mobile="isMobile"
															:is-tablet="isTablet"
														/>
														<CharacterFictionality
															v-if="character.metacharacterId != null"
															fictionality="Metacharakter"
															:is-detail-view="false"
															:is-mobile="isMobile"
															:is-tablet="isTablet"
														/>
														<Button
															class="flex cursor-pointer items-center p-0 text-base font-normal underline decoration-dotted hover:no-underline"
															variant="transparent"
															@click="
																setQueryAndRelation('Charakter', character.id, 'Nebenfigur');
																setMetaId(character.metacharacterId);
															"
														>
															{{ character.name }}
															<span class="sr-only">Charakter anzeigen</span>
														</Button>
													</span>
												</div>
											</div>
											<div v-else class="text-sm text-muted-foreground">
												Keine Nebenfiguren vorhanden.
											</div>
										</div>
										<div>
											<div class="pb-2 font-semibold">Erwähnte Figuren</div>
											<div v-if="characters.spokenOf != null && characters.spokenOf.length > 0">
												<div v-for="character in characters.spokenOf" :key="character.name">
													<span v-if="character.fictionality" class="flex items-center gap-1">
														<span class="grid grid-cols-[auto_1fr] items-center gap-1">
															<CharacterFictionality
																:fictionality="character.fictionality"
																:is-detail-view="false"
																:is-mobile="isMobile"
																:is-tablet="isTablet"
															/>
															<CharacterFictionality
																v-if="character.metacharacterId != null"
																fictionality="Metacharakter"
																:is-detail-view="false"
																:is-mobile="isMobile"
																:is-tablet="isTablet"
															/>
															<Button
																class="flex cursor-pointer items-center p-0 text-base font-normal underline decoration-dotted hover:no-underline"
																variant="transparent"
																@click="
																	setQueryAndRelation('Charakter', character.id, 'Erwähnte Figur');
																	setMetaId(character.metacharacterId);
																"
															>
																{{ character.name }}
																<span class="sr-only">Charakter anzeigen</span>
															</Button>
														</span>
													</span>
												</div>
											</div>
											<div v-else class="text-sm text-muted-foreground">
												Keine erwähnten Figuren vorhanden.
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div>
						<Accordion
							:key="work?.id"
							:class="
								(places.takesPlaceIn && places.takesPlaceIn?.length > 0) ||
								(places.discussed && places.discussed.length > 0) ||
								(places.mentioned && places.mentioned.length > 0)
									? `font-normal`
									: `font-normal text-frisch-grey`
							"
							collapsible
							:disabled="
								(places.takesPlaceIn && places.takesPlaceIn?.length > 0) ||
								(places.discussed && places.discussed.length > 0) ||
								(places.mentioned && places.mentioned.length > 0)
									? false
									: true
							"
							type="single"
						>
							<AccordionItem value="places">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Orte</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div>
										<div class="grid grid-rows-[auto_auto_auto] gap-4 2xl:grid-cols-3">
											<div>
												<div class="pb-2 font-semibold">Schauplätze</div>
												<div v-if="places.takesPlaceIn != null && places.takesPlaceIn.length > 0">
													<div v-for="place in places.takesPlaceIn" :key="place.id">
														<span class="grid grid-cols-[auto_1fr] items-center gap-1">
															<Button
																class="flex cursor-pointer items-start gap-1 p-0 text-base font-normal underline decoration-dotted hover:no-underline"
																variant="transparent"
																@click="setQueryAndRelation('Ort', place.id, 'Schauplatz')"
															>
																{{ place.name }}
																<span class="sr-only">Ort anzeigen</span>
															</Button>
														</span>
													</div>
												</div>
												<div v-else class="text-sm text-muted-foreground">
													Keine Schauplätze vorhanden.
												</div>
											</div>
											<div>
												<div class="pb-2 font-semibold">Beschriebene Orte</div>
												<div v-if="places.discussed != null && places.discussed.length > 0">
													<div v-for="place in places.discussed" :key="place.id">
														<span class="grid grid-cols-[auto_1fr] items-center gap-1">
															<Button
																class="flex cursor-pointer items-start gap-1 p-0 text-base font-normal underline decoration-dotted hover:no-underline"
																variant="transparent"
																@click="setQueryAndRelation('Ort', place.id, 'Beschriebener Ort')"
															>
																{{ place.name }}
																<span class="sr-only">Ort anzeigen</span>
															</Button>
														</span>
													</div>
												</div>
												<div v-else class="text-sm text-muted-foreground">
													Keine beschriebenen Orte vorhanden.
												</div>
											</div>
											<div>
												<div class="pb-2 font-semibold">Erwähnte Orte</div>
												<div v-if="places.mentioned != null && places.mentioned.length > 0">
													<div v-for="place in places.mentioned" :key="place.id">
														<span class="grid grid-cols-[auto_1fr] items-center gap-1">
															<Button
																class="flex cursor-pointer items-start gap-1 p-0 text-base font-normal underline decoration-dotted hover:no-underline"
																variant="transparent"
																@click="setQueryAndRelation('Ort', place.id, 'Erwähnter Ort')"
															>
																{{ place.name }}
																<span class="sr-only">Ort anzeigen</span>
															</Button>
														</span>
													</div>
												</div>
												<div v-else class="text-sm text-muted-foreground">
													Keine erwähnten Orte vorhanden.
												</div>
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div>
						<Accordion
							:key="work?.id"
							:class="
								(relatedWork.references && relatedWork.references?.length > 0) ||
								(relatedWork.discussedIn && relatedWork.discussedIn.length > 0) ||
								(relatedWork.referencedIn && relatedWork.referencedIn.length > 0)
									? `font-normal`
									: `font-normal text-frisch-grey`
							"
							collapsible
							:disabled="
								(relatedWork.references && relatedWork.references?.length > 0) ||
								(relatedWork.discussedIn && relatedWork.discussedIn.length > 0) ||
								(relatedWork.referencedIn && relatedWork.referencedIn.length > 0)
									? false
									: true
							"
							type="single"
						>
							<AccordionItem value="relations">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Bezüge</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div>
										<div class="grid grid-rows-[auto_auto_auto] gap-4 2xl:grid-cols-3">
											<div>
												<div class="pb-2 font-semibold">Erwähnte Werke</div>
												<div v-if="relatedWork.references && relatedWork.references.length > 0">
													<div v-for="relation in relatedWork.references" :key="relation.id">
														<NuxtLink
															class="underline decoration-dotted transition hover:no-underline focus-visible:no-underline"
															:href="`/work/${relation.id}`"
														>
															{{ relation.title }}
														</NuxtLink>
													</div>
												</div>
												<div v-else class="text-sm text-muted-foreground">
													Keine Bezüge vorhanden.
												</div>
											</div>
											<div>
												<div class="pb-2 font-semibold">Wurde erwähnt in</div>
												<div v-if="relatedWork.referencedIn && relatedWork.referencedIn.length > 0">
													<div v-for="relation in relatedWork.referencedIn" :key="relation.id">
														<NuxtLink
															class="underline decoration-dotted transition hover:no-underline focus-visible:no-underline"
															:href="`/work/${relation.id}`"
														>
															{{ relation.title }}
														</NuxtLink>
													</div>
												</div>
												<div v-else class="text-sm text-muted-foreground">
													Keine Bezüge vorhanden.
												</div>
											</div>
											<div>
												<div class="pb-2 font-semibold">Wurde besprochen in</div>
												<div v-if="relatedWork.discussedIn && relatedWork.discussedIn.length > 0">
													<div v-for="relation in relatedWork.discussedIn" :key="relation.id">
														<NuxtLink
															class="underline decoration-dotted transition hover:no-underline focus-visible:no-underline"
															:href="`/work/${relation.id}`"
														>
															{{ relation.title }}
														</NuxtLink>
													</div>
												</div>
												<div v-else class="text-sm text-muted-foreground">
													Keine Bezüge vorhanden.
												</div>
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div>
						<Accordion
							:key="work?.id"
							:class="
								work?.physical_objects && work?.physical_objects.length > 0
									? `font-normal`
									: `font-normal text-frisch-grey`
							"
							collapsible
							:disabled="work?.physical_objects && work?.physical_objects.length > 0 ? false : true"
							type="single"
						>
							<AccordionItem value="relations">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Physische Objekte</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div>
										<div>
											<div v-if="work?.physical_objects && work?.physical_objects.length > 0">
												<div
													class="grid grid-rows-[auto_auto_auto] gap-4 2xl:grid-cols-[auto_1fr] 2xl:gap-10"
												>
													<div>
														<div class="pb-2 font-semibold">Archiv</div>
														<div v-for="thing in work?.physical_objects" :key="thing.id">
															<div>
																{{ thing.archive?.name }}
															</div>
														</div>
													</div>
													<div>
														<div class="pb-2 font-semibold">Objekt</div>
														<div v-for="thing in work?.physical_objects" :key="thing.id">
															<div>{{ thing.name }}</div>
														</div>
													</div>
												</div>
											</div>
											<div v-else class="text-sm text-muted-foreground">
												Keine physikalischen Objekte vorhanden.
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
				<div class="hidden md:block md:bg-white md:py-8">
					<div class="grid grid-cols-[auto_1fr] items-center gap-4">
						<div
							class="size-0 border-y-[55px] border-l-[55px] border-y-transparent border-l-frisch-marine"
						/>
						<div class="py-2 text-lg font-semibold">Analyse</div>
					</div>
					<div class="block hyphens-auto px-16 text-justify">
						<div v-if="work?.text_analysis">
							{{ work?.text_analysis }}
						</div>
						<div v-else class="text-sm text-muted-foreground">Keine Analyse vorhanden.</div>
						<div v-if="analysisTags.length > 0" class="py-4">
							<span v-for="tag in analysisTags" :key="tag.name" class="mb-2 mr-1">
								<span v-if="!isTablet">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger as-child>
												<span
													class="mb-1 inline-block cursor-default bg-frisch-orange px-2 py-1 text-xs text-white opacity-85"
												>
													{{ tag.value }}
												</span>
											</TooltipTrigger>
											<TooltipContent>
												<p>{{ tag.name }}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</span>
								<span v-else>
									<Popover>
										<PopoverTrigger>
											<span
												class="mb-1 inline-block cursor-default bg-frisch-orange px-2 py-1 text-xs text-white opacity-85"
											>
												{{ tag.value }}
											</span>
										</PopoverTrigger>
										<PopoverContent>
											{{ tag.name }}
										</PopoverContent>
									</Popover>
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Centered v-else class="pointer-events-none">
			<LoadingSpinner />
		</Centered>
		<div v-show="isOpenPlace">
			<MapSidebar
				class="absolute"
				:is-mobile="isMobile"
				:is-open="isOpenPlace"
				:relation="currentRelation"
				@close-side-bar="closeSidebar()"
			/>
		</div>
		<div v-show="isOpenCharacter">
			<CharacterSidebar
				class="absolute"
				:fictionality="currentRelation"
				:is-mobile="isMobile"
				:is-open="isOpenCharacter"
				:meta-id="currentMetaId"
				@close-side-bar="closeSidebar()"
			/>
		</div>
	</MainContent>
</template>
