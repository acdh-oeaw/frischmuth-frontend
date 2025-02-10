<script lang="ts" setup>
import { MenuIcon } from "lucide-vue-next";

import type { NavLinkProps } from "@/components/nav-link.vue";
import { Separator } from "@/components/ui/separator";

const route = useRoute();

const homeLink = { href: { path: "/" } };
const links = computed(() => {
	return {
		search: { href: { path: "/search" }, label: "SUCHE" },
		explore: { href: { path: "/explore" }, label: "ENTDECKEN" },
		about: { href: { path: "/about" }, label: "ÜBER DAS PROJEKT" },
	} satisfies Record<string, { href: NavLinkProps["href"]; label: string }>;
});

const isSidepanelOpen = ref(false);

function close() {
	isSidepanelOpen.value = false;
}
</script>

<template>
	<header class="border-b bg-frisch-marine px-6 lg:px-12">
		<div class="w-full pb-4 pt-8 lg:pt-12">
			<nav>
				<div class="grid grid-cols-[1fr_auto] items-center gap-4 lg:items-end">
					<div class="text-2xl font-semibold text-frisch-orange lg:text-4xl">
						<NavLink :href="homeLink.href">
							Digitales Archiv
							<br aria-hidden="true" />
							Barbara Frischmuth
						</NavLink>
					</div>
					<div class="hidden lg:flex">
						<ul
							class="ml-auto flex gap-x-4 font-bold transition"
							:class="
								route.path !== '/'
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-5 pointer-events-none'
							"
							role="list"
						>
							<li
								v-for="(link, key, index) of links"
								:key="key"
								class="flex shrink-0 gap-x-4 text-xl"
							>
								<Separator v-if="index > 0" class="h-full w-0.5 bg-frisch-orange" />
								<NavLink
									class="text-frisch-orange transition hover:text-frisch-indigo aria-[current]:text-frisch-indigo"
									:href="link.href"
								>
									{{ link.label }}
								</NavLink>
							</li>
						</ul>
					</div>
					<div class="flex shrink-0 lg:hidden">
						<Sheet v-model:open="isSidepanelOpen">
							<SheetTrigger
								aria-label="Toggle navigation menu"
								class="flex font-bold transition"
								:class="
									route.path !== '/'
										? 'opacity-100 translate-y-0'
										: 'opacity-0 translate-x-5 pointer-events-none'
								"
							>
								<MenuIcon class="bg-frisch-orange p-1 text-white" :size="32" />
							</SheetTrigger>
							<SheetContent class="overflow-y-auto">
								<SheetTitle class="sr-only">Navigationsmenü</SheetTitle>
								<ul class="grid py-8" role="list">
									<li v-for="(link, key) of links" :key="key">
										<NavLink
											class="flex py-2 font-medium text-frisch-orange transition-opacity hover:opacity-100 focus-visible:opacity-100 aria-[current]:text-frisch-indigo"
											:href="link.href"
											@click="close"
										>
											{{ link.label }}
										</NavLink>
									</li>
								</ul>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</nav>
		</div>
	</header>
</template>
