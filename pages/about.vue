<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

import type { SystemPage, TeamMember } from "@/types/content";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("AboutPage.meta.title"),
});

const { data: team, error } = useQuery({
	queryKey: ["system-pages", "about-team"] as const,
	queryFn() {
		return queryContent<SystemPage>("system-pages", "about-team").findOne();
	},
});

useErrorMessage(error, {
	notFound: "Seite nicht gefunden",
	unknown: "Interner Fehler",
});

const { data: journey } = useQuery({
	queryKey: ["system-pages", "about-journey"] as const,
	queryFn() {
		return queryContent<SystemPage>("system-pages", "about-journey").findOne();
	},
});

const { data: memberList } = useQuery({
	queryKey: ["team"] as const,
	queryFn() {
		return queryContent<TeamMember>("team").find();
	},
});
</script>

<template>
	<MainContent class="container grid grid-cols-[2fr_3fr] gap-8 py-8">
		<div class="flex justify-end">
			<Card class="size-72 bg-frisch-grey">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">Über das Projekt</h1>
				</CardContent>
			</Card>
		</div>
		<div class="prose max-w-3xl">
			<ContentRenderer
				v-if="team != null"
				:value="team"
				class="prose prose-lg max-w-3xl text-balance text-center"
			>
				<h2 class="font-bold text-frisch-orange">
					{{ team.title }}
				</h2>
				<ContentRendererMarkdown :value="team" />
				<template #empty></template>
			</ContentRenderer>

			<ContentRenderer
				v-if="journey != null"
				:value="journey"
				class="prose prose-lg text-balance text-center"
			>
				<ul class="list-none px-0 pt-8">
					<li
						v-for="member of memberList"
						:key="member._id"
						class="grid grid-cols-[auto_1fr] gap-4 p-0"
					>
						<div class="not-prose relative grid size-72 place-items-center overflow-hidden">
							<img
								v-if="member.image != null"
								alt=""
								class="absolute inset-0 size-full object-cover"
								:src="member.image"
							/>
						</div>
						<div>
							<h2 class="m-0 font-semibold text-frisch-indigo">
								{{ member.firstName }}
								{{ member.lastName }}
							</h2>
							<ContentRenderer :value="member">
								<template #empty></template>
							</ContentRenderer>
						</div>
					</li>
				</ul>

				<h2 class="font-bold text-frisch-orange">
					{{ journey.title }}
				</h2>
				<ContentRendererMarkdown :value="journey" />
				<template #empty></template>
			</ContentRenderer>
		</div>
	</MainContent>
</template>
