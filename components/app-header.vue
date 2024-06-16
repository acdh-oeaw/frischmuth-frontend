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
		<div class="w-full pb-4 pt-12">
			<nav :aria-label="t('AppHeader.navigation-main')">
				<div class="container grid items-end gap-4 lg:grid-cols-2">
					<div class="text-4xl font-semibold text-frisch-orange">
						<NavLink :href="homeLink.href">
							Digitales Archiv
							<br aria-hidden="true" />
							Barbara Frischmuth
						</NavLink>
					</div>
					<ul
						:class="
							route.path !== '/'
								? 'opacity-100 translate-y-0'
								: 'opacity-0 translate-y-5 pointer-events-none'
						"
						class="ml-auto flex gap-x-4 font-bold transition"
						role="list"
					>
						<li
							v-for="(link, key, index) of links"
							:key="key"
							class="flex shrink-0 gap-x-4 text-xl"
						>
							<Separator v-if="index > 0" class="h-full w-0.5 bg-frisch-orange" />
							<NavLink
								:href="link.href"
								class="text-frisch-orange transition hover:text-frisch-indigo aria-[current]:text-frisch-indigo"
							>
								{{ link.label }}
							</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	</header>
</template>
