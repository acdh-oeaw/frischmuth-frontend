<script lang="ts" setup>
import { ListFilter, SearchIcon } from "lucide-vue-next";
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
import type { SearchFacetLanguage, SearchFacetTopic, SearchFacetWorkType } from "@/types/api.ts";

defineRouteRules({
	prerender: true,
});

const filterCount = computed(() => {
	const language = searchFilters.value.language;
	const topic = searchFilters.value.topic;
	const workType = searchFilters.value.workType;
	let year: Array<string> = [];
	if (searchFilters.value.startYear != null && searchFilters.value.endYear != null) {
		year = [route.query.startYear as string, route.query.endYear as string];
	}

	return language.length + topic.length + workType.length + (year.length ? 1 : 0);
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

const minYear = 1500;
const maxYear = 2050;

const searchFiltersSchema = v.pipe(
	v.object({
		query: v.fallback(v.string(), ""),
		workType: v.fallback(v.array(v.string()), []),
		startYear: v.optional(
			v.pipe(
				v.string(),
				v.transform(Number),
				v.number(),
				v.integer(),
				v.minValue(minYear),
				v.maxValue(maxYear),
			),
		),
		endYear: v.optional(
			v.pipe(
				v.string(),
				v.transform(Number),
				v.number(),
				v.integer(),
				v.minValue(minYear),
				v.maxValue(maxYear),
			),
		),
		language: v.fallback(v.array(v.string()), []),
		topic: v.fallback(v.array(v.string()), []),
	}),
	v.transform((input) => {
		const { startYear, endYear } = input;
		if (startYear != null && endYear != null && startYear > endYear) {
			return {
				...input,
				startYear: endYear,
				endYear: startYear,
			};
		}
		return input;
	}),
);

const isMobile = computed(() => {
	if (typeof window === "undefined") return false;
	return window.innerWidth < 1024;
});

const searchQuery = computed(() => {
	return route.query.query as string;
});

const offset = ref(0);
const limit = 20;

const isMobileSearchOpen = ref(false);

type SearchFilter = v.InferOutput<typeof searchFiltersSchema>;

const searchFilters = computed(() => {
	// when there is just one query param, it is an Object instead of an Array, so normalize it
	const normalizedQuery = {
		...route.query,
		startYear: route.query.startYear,
		endYear: route.query.endYear,
		workType: normalizeQueryArray(route.query.workType),
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

	if (query.startYear === undefined && query.endYear === undefined) {
		delete query.startYear;
		delete query.endYear;
	}

	const updatedQuery = { ...query, ...route.query };

	void router.push({ query: updatedQuery });
	document.body.scrollTo(0, 0);
}

const { data, isPending } = useGetSearchResults(
	computed(() => {
		return {
			start_year: searchFilters.value.startYear,
			end_year: searchFilters.value.endYear,
			facet_language: searchFilters.value.language as SearchFacetLanguage,
			facet_topic: searchFilters.value.topic as SearchFacetTopic,
			facet_work_type: searchFilters.value.workType as SearchFacetWorkType,
			text_filter: searchFilters.value.query,
			limit,
			offset: offset.value,
		};
	}),
);

let timer: ReturnType<typeof setTimeout> | null = null;

function closeDetailView() {
	if (route.query.work !== undefined) {
		const updatedQuery = { ...route.query };
		delete updatedQuery.work;
		void router.push({ query: updatedQuery });
	}
}

function closeMobileDetailView() {
	isWorkSelected.value = false;
	timer = setTimeout(() => {
		closeDetailView();
	}, 300);
}

const id = computed(() => {
	if (!route.query.work) return undefined;
	return Number(route.query.work);
});

const isLoading = computed(() => {
	return isPending.value;
});

const facets = computed(() => {
	if (data.value?.facets != null) {
		return data.value.facets;
	}
	return null;
});

const isWorkSelected = ref(false);

watch(
	() => id.value,
	(newId) => {
		isWorkSelected.value = newId !== undefined;
	},
	{ immediate: true },
);

onScopeDispose(() => {
	if (timer != null) {
		clearTimeout(timer);
	}
});
</script>

<template>
	<MainContent
		data-layout="constrained"
		class="overflow-x-hidden bg-frisch-marine md:pr-0 lg:overflow-x-auto"
	>
		<h1 class="sr-only">{{ t("SearchPage.title") }}</h1>
		<div
			class="relative grid h-full grid-cols-[1fr_0px] md:transition-all md:delay-150 md:data-[workdetail]:grid-cols-[1fr_650px] md:data-[workdetail]:gap-8 md:data-[workdetail]:pr-0 2xl:pr-20 2xl:ease-in-out"
			:data-workdetail="id != null ? 'true' : undefined"
		>
			<div>
				<div
					v-if="!isLoading"
					class="grid h-full grid-rows-[auto_1fr] md:grid-cols-2 md:gap-8 lg:grid-rows-none 2xl:grid-cols-[minmax(650px,_1fr)_3fr]"
				>
					<div class="hidden md:block">
						<SearchForm query="" @submit="onChange">
							<SearchTextInput :search-query="searchQuery ?? ''" />
							<SearchFilter :filter-count="filterCount" :facets="facets" />
						</SearchForm>
					</div>
					<div class="flex md:hidden">
						<Drawer v-model:open="isMobileSearchOpen">
							<DrawerTrigger class="w-full">
								<span
									class="grid w-full grid-cols-2 items-center bg-frisch-orange-searchform text-frisch-orange"
								>
									<div class="flex items-center">
										<SearchIcon :size="32" class="m-1.5 p-1" />
										<span class="font-semibold">Suche</span>
									</div>
									<div class="flex justify-end px-4">
										<div class="ml-auto grid grid-cols-[1fr_auto] items-center gap-1">
											<div class="font-semibold">({{ filterCount }}) Filter</div>
											<ListFilter />
										</div>
									</div>
								</span>
							</DrawerTrigger>
							<DrawerContent>
								<SearchForm query="" @submit="onChange">
									<SearchTextInput :search-query="searchQuery ?? ''" />
									<SearchFilter :facets="facets" :filter-count="filterCount" />
								</SearchForm>
							</DrawerContent>
						</Drawer>
					</div>
					<div v-if="data != null" class="w-full !overflow-auto bg-white px-3 pt-4 lg:p-8">
						<div class="hidden font-semibold text-frisch-indigo md:block lg:pt-9">
							Suchergebnisse ({{ data.count }})
						</div>
						<div
							v-if="searchQuery != null"
							class="block font-semibold text-frisch-indigo md:hidden lg:pt-9"
						>
							<p>
								{{ data.count }}
								{{ data.count === 1 ? "Suchergebnis" : "Suchergebnisse" }}
								für "{{ searchQuery }}"
							</p>
						</div>
						<div v-else class="block font-semibold text-frisch-indigo md:hidden">
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
			</div>
			<div class="h-full overflow-y-auto">
				<WorkDetailSidebar
					v-if="id != null"
					class="relative grid h-full"
					:work-id="id"
					@close-detail-view="closeDetailView()"
				/>
			</div>
		</div>
		<div v-if="isMobile && id != null">
			<Drawer v-model:open="isWorkSelected">
				<DrawerContent>
					<MobileWorkDetailDrawer :work-id="id" @close-detail-view="closeMobileDetailView()" />
				</DrawerContent>
			</Drawer>
		</div>
	</MainContent>
</template>
