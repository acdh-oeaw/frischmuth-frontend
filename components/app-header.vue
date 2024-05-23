<script lang="ts" setup>
import type { NavLinkProps } from "@/components/nav-link.vue";
import { Separator } from "@/components/ui/separator";

const t = useTranslations();
const route = useRoute();
const homeLink = { href: { path: "/" } };
const links = computed(() => {
	return {
		search: { href: { path: "/search" }, label: "SUCHE" },
		explore: { href: { path: "/explore" }, label: "ENTDECKEN" },
		about: { href: { path: "/about" }, label: "ÜBER DAS PROJEKT" },
	} satisfies Record<string, { href: NavLinkProps["href"]; label: string }>;
});
</script>

<template>
	<header class="border-b bg-frisch-marine">
		<div class="w-full pb-4 pt-10">
			<nav :aria-label="t('AppHeader.navigation-main')">
				<ul class="container grid grid-cols-2 items-end text-frisch-orange" role="list">
					<div class="text-2xl font-extrabold">
						<NavLink :href="homeLink.href">
							Digitales Archiv
							<br />
							Barbara Frischmuth
						</NavLink>
					</div>
					<div v-if="route.path !== '/'" class="ml-auto flex gap-x-4 font-semibold">
						<li v-for="(link, key, index) of links" :key="key" class="flex shrink-0 gap-x-4">
							<Separator v-if="index > 0" class="h-5 w-0.5 bg-frisch-orange" />
							<NavLink :href="link.href" class="hover:text-frisch-indigo">
								{{ link.label }}
							</NavLink>
						</li>
					</div>
				</ul>
			</nav>
		</div>
	</header>
</template>
