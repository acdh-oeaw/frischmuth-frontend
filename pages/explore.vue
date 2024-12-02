<script lang="ts" setup>
defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("ExplorePage.meta.title"),
});
</script>

<template>
	<MainContent class="container p-4 lg:py-8">
		<h1 class="sr-only">{{ t("ExplorePage.title") }}</h1>
		<div class="mx-auto flex size-full max-h-full items-center justify-center font-semibold">
			<div
				class="mx-auto grid max-h-full grid-cols-2 gap-2 font-bold lg:gap-4 lg:text-2xl lg:grid-fluid-cols-72"
			>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				>
					<span>ORTE</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				>
					<span class="relative">Istanbul</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
				>
					<span>"Und dann fiel ich aus den Wolken"</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				>
					<span>FORSCHUNGS-HINSICHTEN</span>
				</Card>
				<Card class="relative aspect-square overflow-hidden p-4 transition hover:scale-105">
					<img
						alt=""
						class="absolute inset-0 size-full object-cover"
						src="/assets/images/writing_placeholder.png"
					/>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				>
					<span>Aus dem Archiv</span>
				</Card>
				<NuxtLink
					to="/biography"
					class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				>
					<span>BIOGRAFIE</span>
				</NuxtLink>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-indigo p-4 text-white transition hover:scale-105"
				>
					<span>JOURNALISTISCHE REZEPTION</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
				>
					<span>
						"Keine Grenze kann so dicht geschlossen werden, dass sie nicht von denen, die unbedingt
						ihr Glück versuchen wollen, überwunden wird.
					</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				>
					<span>GLOSSAR</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-indigo p-4 text-white transition hover:scale-105"
				>
					<span>AKADEMISCHE REZEPTION</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-orange-light p-4 text-frisch-orange transition hover:scale-105"
				>
					<span>
						"Für die meisten Schriftsteller gibt es ohnehin nur eine wirkliche Heimat, und das ist
						die Sprache, in der sie schreiben."
					</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				>
					<span>Postkoloniale Theorie</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-orange p-4 text-white transition hover:scale-105"
				>
					<span>INTERPRETATEME</span>
				</Card>
				<Card
					class="relative aspect-square overflow-hidden bg-frisch-grey p-4 text-frisch-indigo transition hover:scale-105"
				>
					<span>Kasanapodole</span>
				</Card>
			</div>
		</div>
	</MainContent>
</template>
