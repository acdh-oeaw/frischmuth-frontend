<script lang="ts" setup>
import { EyeIcon, GlobeIcon } from "lucide-vue-next";

import type { Characters, Places, RelatedWork } from "~/types/work";

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

//TODO: add name or surname

const characters: ComputedRef<Characters> = computed(() => {
	return {
		main: work.value?.characters
			?.filter((character) => character.relevancy === "Hauptfigur")
			.map((character) => {
				const fictionality = character.fictionality ? character.fictionality[0] : "";
				return {
					id: character.id,
					name:
						character.fallback_name !== ""
							? character.fallback_name
							: `${character.forename} ${character.surname}`,
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
					name:
						character.fallback_name !== ""
							? character.fallback_name
							: `${character.forename} ${character.surname}`,
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
					name:
						character.fallback_name !== ""
							? character.fallback_name
							: `${character.forename} ${character.surname}`,
					fictionality: fictionality,
					metacharacterId: character.metacharacter ? character.metacharacter.id : null,
				};
			}),
	};
});

const places: ComputedRef<Places> = computed(() => {
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

const relatedWork: ComputedRef<RelatedWork> = computed(() => {
	return {
		discusses: work.value?.related_works
			?.filter((relation) => relation.relation_type === "discusses")
			.map((relation) => ({
				id: relation.id,
				title: relation.title,
				authors: relation.authors,
			})),
		mentions: work.value?.related_works
			?.filter((relation) => relation.relation_type === "mentions")
			.map((relation) => ({
				id: relation.id,
				title: relation.title,
				authors: relation.authors,
			})),
		references: work.value?.related_works
			?.filter((relation) => relation.relation_type === "references")
			.map((relation) => ({
				id: relation.id,
				title: relation.title,
				authors: relation.authors,
			})),
		discussedIn: work.value?.related_works
			?.filter((relation) => relation.relation_type === "is discussed in")
			.map((relation) => ({
				id: relation.id,
				title: relation.title,
				authors: relation.authors,
			})),
		mentionedIn: work.value?.related_works
			?.filter((relation) => relation.relation_type === "is mentioned in")
			.map((relation) => ({
				id: relation.id,
				title: relation.title,
				authors: relation.authors,
			})),
		referencedIn: work.value?.related_works
			?.filter((relation) => relation.relation_type === "is referenced in")
			.map((relation) => ({
				id: relation.id,
				title: relation.title,
				authors: relation.authors,
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

const authors = computed(() => {
	const authors: Array<string> = [];

	work.value?.persons?.forEach((person) => {
		const name = `${person.forename} ${person.surname}`;
		if (person.relation_type === "has author") {
			authors.push(name);
		}
	});

	const formattedAuthors = authors.join(", ");
	return formattedAuthors ? formattedAuthors : "";
});

const editors = computed(() => {
	const editors: Array<string> = [];

	work.value?.persons?.forEach((person) => {
		const name = `${person.forename} ${person.surname}`;
		if (person.relation_type === "has editor") {
			editors.push(name);
		}
	});

	const formattedEditors = editors.join(", ");
	return formattedEditors ? formattedEditors : "";
});

const interpretatems = computed(() => {
	return work.value?.interpretatems;
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
const metaDataAuthors = computed(() => {
	const authors: Array<{ forename: string; surname: string }> = [];

	work.value?.persons?.forEach((person) => {
		if (person.relation_type === "has author") {
			authors.push({ forename: person.forename ?? "", surname: person.surname ?? "" });
		}
	});
	return authors;
});

const metadataEditors = computed(() => {
	const editors: Array<{ forename: string; surname: string }> = [];

	work.value?.persons?.forEach((person) => {
		if (person.relation_type === "has editor") {
			editors.push({ forename: person.forename ?? "", surname: person.surname ?? "" });
		}
	});

	return editors;
});

function setMetaId(id: number | null) {
	currentMetaId.value = id;
}

const isOpen = ref(false);
function openDrawer() {
	isOpen.value = !isOpen.value;
}
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<MainContent class="relative grid h-full bg-frisch-marine md:pr-14 2xl:pr-20">
		<div v-if="!isLoading" class="grid h-full md:grid-cols-[auto_1fr]">
			<div
				class="hidden size-0 border-y-[85px] border-l-[85px] border-y-transparent border-l-frisch-orange md:block md:border-y-[65px] md:border-l-[65px]"
			/>

			<div class="grid md:grid-cols-2 md:gap-8">
				<div v-if="work != null" class="bg-white p-8 lg:p-16">
					<div id="print-metadata">
						<div class="grid w-full grid-cols-2 items-center pb-2">
							<div
								v-if="work?.work_type != null && icon"
								id="work-type"
								class="flex items-center gap-2"
							>
								<component :is="icon.icon" :size="20" />
								{{ work?.work_type[0]?.name }}
							</div>
							<div class="flex flex-row gap-2 place-self-end">
								<CitationButton
									:authors="metaDataAuthors ?? []"
									:editors="metadataEditors ?? []"
									:metadata="[work?.expression_data]"
								/>
								<PrintingHandler
									:characters="characters"
									:places="places"
									:related-work="relatedWork"
								/>
							</div>
						</div>
						<div
							v-if="authors && work?.work_type != null && work?.work_type[0]?.name != 'Sammelband'"
							class="italic"
						>
							{{ authors }}
						</div>
						<div
							v-if="editors && work?.work_type != null && work?.work_type[0]?.name == 'Sammelband'"
							class="inline-flex gap-1 italic"
						>
							<span>{{ editors }}</span
							><span>{{ "(Hg.)" }}</span>
						</div>
						<div class="pb-2">
							<h1 class="text-xl font-semibold">
								{{ work?.title }}
							</h1>
							<div v-if="work?.subtitle">
								{{ work?.subtitle }}
							</div>
						</div>
						<!-- Can be resolved after api exposes relevant data -->
						<!-- <div v-if="editors &&  work?.work_type[0].name == 'Sammelband'" class="inline-flex gap-1 italic">
							<span>{{ "(Hg.):" }}</span>
							<span>{{ editors }}</span>
						</div> -->
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
							<div
								class="mb-1 inline-block bg-frisch-indigo px-2 py-1 text-xs text-white opacity-85"
							>
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
						<div id="mobile-drawer" class="block md:hidden">
							<Drawer v-model:open="isOpen">
								<Button class="items-center p-0" variant="transparent" @click="openDrawer()">
									<span
										class="grid grid-cols-[auto_1fr] items-center gap-2 pt-2 text-frisch-orange"
									>
										<EyeIcon :size="16" />
										<span class="flex justify-start font-semibold">Analyse</span>
									</span>
								</Button>
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
											<div v-else class="text-sm text-muted-foreground">
												Keine Analyse vorhanden.
											</div>
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
						<div
							v-if="work?.summary"
							class="prose min-w-full hyphens-auto text-black"
							v-html="work?.summary"
						/>
						<div v-else class="text-sm text-muted-foreground">Keine Zusammenfassung vorhanden.</div>
					</div>
					<DetailAccordion
						id="accordion-context"
						:disabled="work?.context || work?.historical_events ? false : true"
						:key-value="work?.id ?? 0"
						title="Kontexte"
					>
						<div v-if="work?.context || work?.historical_events">
							<div class="pb-1">
								<div class="prose min-w-full text-black" v-html="work?.context" />
							</div>
							<div v-if="work?.historical_events">
								<span class="font-semibold">Historische Kontexte:&nbsp;</span>
								<div class="prose min-w-full text-black" v-html="work?.historical_events" />
							</div>
						</div>
						<div v-else class="text-sm text-muted-foreground">Keine Kontexte vorhanden.</div>
					</DetailAccordion>
					<DetailAccordion
						id="accordion-characters"
						:disabled="
							(characters.main && characters.main?.length > 0) ||
							(characters.secondary && characters.secondary?.length > 0) ||
							(characters.spokenOf && characters.spokenOf?.length > 0)
								? false
								: true
						"
						:key-value="work?.id ?? 0"
						title="Charaktere"
					>
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
												id="character"
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
												id="character"
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
													id="character-spokenOf"
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
					</DetailAccordion>
					<DetailAccordion
						id="accordion-places"
						:disabled="
							(places.takesPlaceIn && places.takesPlaceIn?.length > 0) ||
							(places.discussed && places.discussed.length > 0) ||
							(places.mentioned && places.mentioned.length > 0)
								? false
								: true
						"
						:key-value="work?.id ?? 0"
						title="Orte"
					>
						<div>
							<div class="grid grid-rows-[auto_auto_auto] gap-4 2xl:grid-cols-3">
								<div>
									<div class="pb-2 font-semibold">Schauplätze</div>
									<div v-if="places.takesPlaceIn != null && places.takesPlaceIn.length > 0">
										<div v-for="place in places.takesPlaceIn" :key="place.id">
											<span class="grid grid-cols-[auto_1fr] items-center gap-1">
												<Button
													id="place-takesPlaceIn"
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
													id="place-discussed"
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
													id="place-mentioned"
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
					</DetailAccordion>
					<DetailAccordion
						id="accordion-related-works"
						:disabled="
							(relatedWork.discusses && relatedWork.discusses?.length > 0) ||
							(relatedWork.mentions && relatedWork.mentions.length > 0) ||
							(relatedWork.references && relatedWork.references?.length > 0) ||
							(relatedWork.discussedIn && relatedWork.discussedIn.length > 0) ||
							(relatedWork.referencedIn && relatedWork.referencedIn.length > 0) ||
							(relatedWork.mentionedIn && relatedWork.mentionedIn.length > 0)
								? false
								: true
						"
						:key-value="work?.id ?? 0"
						title="Bezüge"
					>
						<div class="grid grid-rows-[auto_auto_auto] gap-4">
							<RelatedWorkDisplay :related-work="relatedWork.discusses" relation="discusses" />
							<RelatedWorkDisplay :related-work="relatedWork.mentions" relation="mentions" />
							<RelatedWorkDisplay :related-work="relatedWork.references" relation="references" />
							<Separator class="h-[3px] bg-frisch-marine" />
							<RelatedWorkDisplay :related-work="relatedWork.discussedIn" relation="discussedIn" />
							<RelatedWorkDisplay :related-work="relatedWork.mentionedIn" relation="mentionedIn" />
							<RelatedWorkDisplay
								:related-work="relatedWork.referencedIn"
								relation="referencedIn"
							/>
						</div>
					</DetailAccordion>
					<DetailAccordion
						id="accordion-physical-objects"
						:disabled="work?.physical_objects && work?.physical_objects.length > 0 ? false : true"
						:key-value="work?.id ?? 0"
						title="Physische Objekte"
					>
						<div>
							<div>
								<div v-if="work?.physical_objects && work?.physical_objects.length > 0">
									<div
										class="grid grid-rows-[auto_auto_auto] gap-4 2xl:grid-cols-[auto_1fr] 2xl:gap-10"
									>
										<div>
											<div class="pb-2 font-semibold">Archiv</div>
											<div v-for="thing in work?.physical_objects" :key="thing.id">
												<div class="pb-2">
													{{ thing.archive?.name }}
												</div>
											</div>
										</div>
										<div>
											<div class="pb-2 font-semibold">Objekt</div>
											<div v-for="thing in work?.physical_objects" :key="thing.id">
												<div class="pb-2">{{ thing.name }}</div>
											</div>
										</div>
									</div>
								</div>
								<div v-else class="text-sm text-muted-foreground">
									Keine physikalischen Objekte vorhanden.
								</div>
							</div>
						</div>
					</DetailAccordion>
				</div>
				<div class="hidden md:block md:bg-white md:py-8">
					<div class="grid grid-cols-[auto_1fr] items-center gap-4">
						<div
							class="size-0 border-y-[55px] border-l-[55px] border-y-transparent border-l-frisch-marine"
						/>
						<h2 class="py-2 text-lg font-semibold">Analyse</h2>
					</div>
					<div
						:id="work?.text_analysis || analysisTags.length > 0 ? 'print-analysis' : ''"
						class="prose block min-w-full hyphens-auto px-16 text-justify text-black"
					>
						<div
							v-if="work?.text_analysis"
							class="prose min-w-full hyphens-auto text-black"
							v-html="work?.text_analysis"
						/>
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
						<div v-if="interpretatems && interpretatems.length > 0">
							<InterpretatemDisplay :interpretatems="interpretatems ?? []" />
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

<style scoped>
.prose :deep(a) {
	@apply underline font-normal decoration-dotted transition hover:no-underline focus-visible:no-underline;
}
</style>
