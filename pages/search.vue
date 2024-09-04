<script lang="ts" setup>
import * as v from "valibot";
import type { LocationQueryValue } from "vue-router";

import type { SearchFormData } from "@/components/search-form.vue";
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

const offset = ref(0);
const limit = 20;

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
			facet_language: searchFilters.value.language,
			facet_topic: searchFilters.value.topic,
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
	<MainContent class="bg-frisch-marine pr-20">
		<h1 class="sr-only">{{ t("SearchPage.title") }}</h1>
		<div v-if="!isLoading" class="grid h-full grid-cols-[minmax(650px,_1fr)_3fr]">
			<SearchForm query="" @submit="onChange">
				<SearchTextInput />
				<SearchFilter :facets="facets" />
			</SearchForm>
			<div v-if="data != null" class="w-full bg-white p-8">
				<div class="pt-9 font-semibold text-frisch-indigo">Suchergebnisse ({{ data.count }})</div>
				<DataTable
					class="flex align-top"
					:data="data.results"
					:results-total="data.count"
				></DataTable>
				<div class="flex justify-center p-8 align-top">
					<Pagination
						v-if="data?.count != null"
						v-slot="{ page }"
						class="justify-self-center"
						:sibling-count="1"
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
