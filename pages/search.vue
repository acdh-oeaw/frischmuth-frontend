<script lang="ts" setup>
import { SearchIcon } from "lucide-vue-next";
import * as v from "valibot";
import type { LocationQueryValue } from "vue-router";

import type { SearchFormData } from "@/components/search-form.vue";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
	Pagination,
	PaginationEllipsis,
	PaginationFirst,
	PaginationLast,
	PaginationList,
	PaginationListItem,
	PaginationNext,
	PaginationPrev,
} from "@/components/ui/pagination";
import type { SearchFacetLanguage, SearchFacetTopic } from "@/types/api.ts";

defineRouteRules({
	prerender: true,
});

const router = useRouter();
const route = useRoute();
const t = useTranslations();

usePageMetadata({
	title: t("SearchPage.meta.title"),
});

function onUpdatePage(newPage: number) {
	offset.value = (newPage - 1) * limit;
}

const searchFiltersSchema = v.object({
	query: v.fallback(v.string(), ""),
	language: v.fallback(v.array(v.string()), []),
	topic: v.fallback(v.array(v.string()), []),
});

const isMobile = computed(() => {
	return window.innerWidth < 1024;
});

const offset = ref(0);
const limit = 20;

const isMobileSearchOpen = ref(false);

type SearchFilter = v.InferOutput<typeof searchFiltersSchema>;

const searchFilters = computed(() => {
	// when there is just one query param, it is an Object instead of an Array, so normalize it
	const normalizedQuery = {
		...route.query,
		language: normalizeQueryArray(route.query.language),
		topic: normalizeQueryArray(route.query.topic),
	};

	return v.parse(searchFiltersSchema, normalizedQuery);
});

function normalizeQueryArray(param: Array<LocationQueryValue> | LocationQueryValue | undefined) {
	if (Array.isArray(param)) {
		return param;
	}
	if (typeof param === "string") {
		return [param];
	}
	return [];
}

function onChange(values: SearchFormData) {
	setSearchFilters(values);
	isMobileSearchOpen.value = false;
}

function setSearchFilters(query: Partial<SearchFilter>) {
	if (query.query === "") {
		delete query.query;
	}

	void router.push({ query });
	document.body.scrollTo(0, 0);
}

const { data, isPending } = useGetSearchResults(
	computed(() => {
		return {
			facet_language: searchFilters.value.language as SearchFacetLanguage,
			facet_topic: searchFilters.value.topic as SearchFacetTopic,
			text_filter: searchFilters.value.query,
			limit,
			offset: offset.value,
		};
	}),
);

const isLoading = computed(() => {
	return isPending.value;
});

const facets = computed(() => {
	if (data.value?.facets != null) {
		return data.value.facets;
	}
	return null;
});
</script>

<template>
	<MainContent class="overflow-x-hidden bg-frisch-marine lg:overflow-x-auto lg:pr-20">
		<h1 class="sr-only">{{ t("SearchPage.title") }}</h1>
		<div
			v-if="!isLoading"
			class="grid h-full grid-rows-[auto_1fr] lg:grid-cols-[minmax(650px,_1fr)_auto_3fr] lg:grid-rows-none"
		>
			<div class="hidden lg:block">
				<SearchForm query="" @submit="onChange">
					<SearchTextInput />
					<SearchFilter :facets="facets" />
				</SearchForm>
			</div>
			<div
				class="hidden size-0 border-y-[85px] border-l-[85px] border-y-transparent border-l-frisch-orange lg:block"
			/>
			<div class="flex lg:hidden">
				<Drawer v-model:open="isMobileSearchOpen">
					<DrawerTrigger class="w-full">
						<span class="flex w-full items-center bg-frisch-orange-searchform">
							<SearchIcon :size="32" class="m-1.5 p-1 text-frisch-orange" />
							<span class="font-semibold text-frisch-orange">Suche</span>
						</span>
					</DrawerTrigger>
					<DrawerContent>
						<SearchForm query="" @submit="onChange">
							<SearchTextInput />
							<SearchFilter :facets="facets" />
						</SearchForm>
					</DrawerContent>
				</Drawer>
			</div>
			<div v-if="data != null" class="w-full !overflow-auto bg-white px-3 pt-4 lg:p-8">
				<div class="font-semibold text-frisch-indigo lg:pt-9">
					Suchergebnisse ({{ data.count }})
				</div>
				<div class="!overflow-auto">
					<DataTable
						class="flex align-top"
						:data="data.results"
						:results-total="data.count"
						:is-mobile="isMobile"
					/>
				</div>
				<div class="flex justify-center p-8 align-top">
					<Pagination
						v-if="data?.count != null"
						v-slot="{ page }"
						class="justify-self-center"
						:sibling-count="isMobile ? 0 : 1"
						:show-edges="true"
						:total="data.count"
						:items-per-page="limit"
						@update:page="onUpdatePage"
					>
						<PaginationList v-slot="{ items }" class="flex items-center gap-1">
							<PaginationFirst />
							<PaginationPrev />

							<template v-for="(item, index) of items">
								<PaginationListItem
									v-if="item.type === 'page'"
									:key="index"
									as-child
									:value="item.value"
								>
									<Button
										class="size-10 p-0"
										:variant="item.value === page ? 'paginationActive' : 'pagination'"
									>
										{{ item.value }}
									</Button>
								</PaginationListItem>
								<PaginationEllipsis v-else :key="item.type" :index="index" />
							</template>

							<PaginationNext :disabled="offset >= data.count - limit" />
							<PaginationLast :disabled="offset >= data.count - limit" />
						</PaginationList>
					</Pagination>
				</div>
			</div>
		</div>
		<Centered v-else class="pointer-events-none">
			<LoadingSpinner />
		</Centered>
	</MainContent>
</template>
