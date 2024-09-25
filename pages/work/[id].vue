<script lang="ts" setup>
import { GlobeIcon, UserRoundIcon, UserRoundPenIcon, VenetianMaskIcon } from "lucide-vue-next";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const route = useRoute();

type Icon = typeof UserRoundIcon;

const characterIcons: Record<string, Icon> = {
	fiktivefigur: UserRoundPenIcon,
	historischefigur: UserRoundIcon,
	mythologischefigur: VenetianMaskIcon,
};

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
			?.filter((character) => character.relevancy === "erwähnte Figur")
			.map((character) => {
				const fictionality = character.fictionality ? character.fictionality[0] : "";
				return {
					name: character.fallback_name,
					fictionality: fictionality,
					icon: setCharacterIcon(fictionality ?? ""),
				};
			}),
		secondary: work.value?.characters
			?.filter((character) => character.relevancy === "erwähnte Figur")
			.map((character) => {
				const fictionality = character.fictionality ? character.fictionality[0] : "";
				return {
					name: character.fallback_name,
					fictionality: fictionality,
					icon: setCharacterIcon(fictionality ?? ""),
				};
			}),
		spokenOf: work.value?.characters
			?.filter((character) => character.relevancy === "erwähnte Figur")
			.map((character) => {
				const fictionality = character.fictionality ? character.fictionality[0] : "";
				return {
					name: character.fallback_name,
					fictionality: fictionality,
					icon: setCharacterIcon(fictionality ?? ""),
				};
			}),
	};
});

function setCharacterIcon(fictionality: string): Icon | null {
	const normalizedFictionality = fictionality
		.toLowerCase()
		.replace(/[-\s,]/g, "") // Removes dashes, spaces, and commas
		.replace(/[^a-zA-Zäöüß]/g, ""); // Removes any non-alphabet characters except for umlauts and ß
	return characterIcons[normalizedFictionality] ?? null;
}

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
</script>

<template>
	<MainContent class="relative grid h-full bg-frisch-marine pr-20">
		<div v-if="!isLoading" class="grid h-full grid-cols-[auto_1fr]">
			<div
				class="size-0 border-y-[85px] border-l-[85px] border-y-transparent border-l-frisch-orange"
			/>
			<div class="grid grid-cols-2 gap-8">
				<div v-if="work != null" class="bg-white p-16">
					<!-- TODO: maybe display siglum here -->
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
							<div v-for="(language, index) in work?.expression_data[0]?.language" :key="index">
								<span>{{ language }}</span>
								<span v-if="index !== work?.expression_data[0]?.language.length - 1">
									{{ ", " }}&nbsp;
								</span>
							</div>
						</div>
					</div>
					<span v-for="topic in work?.topics" :key="topic.id" class="mb-2 mr-1">
						<div class="mb-1 inline-block bg-frisch-grey px-2 py-1 text-xs text-white opacity-85">
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
					<Separator class="my-4 h-[3px] bg-frisch-marine"></Separator>
					<div class="py-2 text-lg font-semibold">Zusammenfassung</div>
					<div v-if="work?.summary" class="block hyphens-auto text-justify">
						{{ work?.summary }}
					</div>
					<div v-else class="text-sm text-muted-foreground">Keine Zusammenfassung vorhanden.</div>
					<Accordion type="single" class="font-normal" collapsible>
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
						<Accordion type="single" collapsible>
							<AccordionItem value="characters">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Charaktere</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div class="grid grid-cols-3 gap-4">
										<div>
											<div class="pb-2 font-semibold">Hauptfiguren</div>
											<div v-if="characters.main != null && characters.main.length > 0">
												<div v-for="character in characters.main" :key="character.name">
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger as-child>
																<component
																	:is="character.icon"
																	:size="16"
																	class="inline text-frisch-orange"
																/>
															</TooltipTrigger>
															<TooltipContent>
																<p>{{ character.fictionality }}</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>

													{{ character.name }}
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
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger as-child>
																<component
																	:is="character.icon"
																	:size="16"
																	class="inline text-frisch-orange"
																/>
															</TooltipTrigger>
															<TooltipContent>
																<p>{{ character.fictionality }}</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>

													{{ character.name }}
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
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger as-child>
																<component
																	:is="character.icon"
																	:size="16"
																	class="inline text-frisch-orange"
																/>
															</TooltipTrigger>
															<TooltipContent>
																<p>{{ character.fictionality }}</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>

													{{ character.name }}
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
						<Accordion type="single" collapsible>
							<AccordionItem value="places">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Orte</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div>
										<div class="grid grid-cols-3 gap-4">
											<div>
												<div class="pb-2 font-semibold">Schauplätze</div>
												<div v-if="places.takesPlaceIn != null && places.takesPlaceIn.length > 0">
													<div v-for="place in places.takesPlaceIn" :key="place.id">
														<span class="grid grid-cols-[auto_1fr] items-center gap-1">
															<span>{{ place.name }}</span>
															<span
																v-if="place.id && place.latitude && place.longitude"
																class="flex items-center"
															>
																<NuxtLink
																	:href="{
																		path: `/work/${work.id}`,
																		query: {
																			place: place.id,
																		},
																	}"
																>
																	<span class="sr-only">Ort anzeigen</span>
																	<MapSidebar :place="place" relation="Schauplatz" />
																</NuxtLink>
															</span>
														</span>
													</div>
												</div>
												<div v-else class="text-sm text-muted-foreground">
													Keine Schauplätze vorhanden.
												</div>
											</div>
											<div>
												<div class="pb-2 font-semibold">Beleuchtete Orte</div>
												<div v-if="places.discussed != null && places.discussed.length > 0">
													<div v-for="place in places.discussed" :key="place.id">
														<span class="grid grid-cols-[auto_1fr] items-center gap-1">
															<span>{{ place.name }}</span>
															<span
																v-if="place.id && place.latitude && place.longitude"
																class="flex items-center"
															>
																<NuxtLink
																	:href="{
																		path: `/work/${work.id}`,
																		query: {
																			place: place.id,
																		},
																	}"
																>
																	<span class="sr-only">Ort anzeigen</span>
																	<MapSidebar :place="place" relation="Beleuchteter Ort" />
																</NuxtLink>
															</span>
														</span>
													</div>
												</div>
												<div v-else class="text-sm text-muted-foreground">
													Keine beleuchteten Orte vorhanden.
												</div>
											</div>
											<div>
												<div class="pb-2 font-semibold">Erwähnte Orte</div>
												<div v-if="places.mentioned != null && places.mentioned.length > 0">
													<div v-for="place in places.mentioned" :key="place.id">
														<span class="grid grid-cols-[auto_1fr] items-center gap-1">
															<span>{{ place.name }}</span>
															<span
																v-if="place.id && place.latitude && place.longitude"
																class="flex items-center"
															>
																<NuxtLink
																	:href="{
																		path: `/work/${work.id}`,
																		query: {
																			place: place.id,
																		},
																	}"
																>
																	<span class="sr-only">Ort anzeigen</span>
																	<MapSidebar :place="place" relation="Erwähnter Ort" />
																</NuxtLink>
															</span>
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
						<Accordion type="single" collapsible>
							<AccordionItem value="relations">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Bezüge</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div>
										<div class="grid grid-cols-3 gap-4">
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
												<div class="pb-2 font-semibold">Wurde diskutiert in</div>
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
						<Accordion type="single" collapsible>
							<AccordionItem value="relations">
								<AccordionTrigger>
									<div class="text-lg font-semibold">Physikalische Objekte</div>
								</AccordionTrigger>
								<AccordionContent class="text-base">
									<div>
										<div>
											<div v-if="work?.physical_objects && work?.physical_objects.length > 0">
												<div class="grid grid-cols-[auto_1fr] gap-10">
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
				<div class="bg-white py-8">
					<div class="grid grid-cols-[auto_1fr] items-center gap-4">
						<div
							class="size-0 border-y-[55px] border-l-[55px] border-y-transparent border-l-frisch-marine"
						/>
						<div class="py-2 text-lg font-semibold">Narratologische Analyse</div>
					</div>
					<div class="block hyphens-auto px-16 text-justify">
						<div v-if="work?.text_analysis">
							{{ work?.text_analysis }}
						</div>
						<div v-else class="text-sm text-muted-foreground">
							Keine narrotologische Analyse vorhanden.
						</div>
						<div v-if="analysisTags.length > 0" class="py-4">
							<span v-for="tag in analysisTags" :key="tag.name" class="mb-2 mr-1">
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
						</div>
					</div>
				</div>
			</div>
		</div>
		<Centered v-else class="pointer-events-none">
			<LoadingSpinner />
		</Centered>
	</MainContent>
</template>
