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

const { data: team, error: teamError } = useQuery({
	queryKey: ["about-team"] as const,
	queryFn() {
		return queryContent<SystemPage>("system-pages", "about-team").findOne();
	},
});

const { data: approach, error: approachError } = useQuery({
	queryKey: ["about-approach"] as const,
	queryFn() {
		return queryContent<SystemPage>("system-pages", "about-approach").findOne();
	},
});

const { data: members, error: membersError } = useQuery({
	queryKey: ["team"] as const,
	queryFn() {
		return queryContent<TeamMember>("team").find();
	},
});

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
useErrorMessage(teamError ?? approachError ?? membersError, {
	notFound: t("AboutPage.errors.404"),
	unknown: t("AboutPage.errors.500"),
});
</script>

<template>
	<MainContent class="grid grid-cols-[2fr_3fr] gap-8 px-12 py-8">
		<div class="flex justify-end">
			<Card class="size-72 bg-frisch-grey">
				<CardContent class="flex size-full py-4 text-2xl font-bold text-white">
					<h1 class="uppercase">{{ t("AboutPage.title") }}</h1>
				</CardContent>
			</Card>
		</div>

		<div class="prose max-w-3xl">
			<ContentRenderer v-if="team != null" :value="team">
				<h2 class="font-bold text-frisch-orange">
					{{ team.title }}
				</h2>
				<ContentRendererMarkdown :value="team" />
				<template #empty></template>
			</ContentRenderer>

			<ul class="list-none px-0 pt-8">
				<li v-for="member of members" :key="member._id" class="grid grid-cols-[auto_1fr] gap-4 p-0">
					<div class="relative size-72 overflow-hidden">
						<img
							v-if="member.image != null"
							alt=""
							class="absolute inset-0 m-0 size-full object-cover"
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

			<ContentRenderer v-if="approach != null" :value="approach">
				<h2 class="font-bold text-frisch-orange">
					{{ approach.title }}
				</h2>
				<ContentRendererMarkdown :value="approach" />
				<template #empty></template>
			</ContentRenderer>
		</div>
	</MainContent>
</template>
