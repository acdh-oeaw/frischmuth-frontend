<script lang="ts" setup>
import * as v from "valibot";

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
const t = useTranslations();

usePageMetadata({
	title: t("SearchPage.meta.title"),
});

function onUpdatePage(newPage: number) {
	offset.value = (newPage - 1) * limit;
}

const searchFiltersSchema = v.object({
	query: v.fallback(v.string(), ""),
});

const offset = ref(0);
const limit = 20;
const searchstring = ref("");

type SearchFilters = v.InferOutput<typeof searchFiltersSchema>;

function onChangeSearchInput(values: SearchFormData) {
	setSearchFilters(values);
}

function setSearchFilters(query: Partial<SearchFilters>) {
	if (query.query === "") {
		delete query.query;
	}

	void router.push({ query });
	document.body.scrollTo(0, 0);
}

const { data } = useGetSearchResults(
	computed(() => {
		return {
			text_filter: searchstring.value,
			limit,
			offset: offset.value,
		};
	}),
);
</script>

<template>
	<main class="h-full bg-frisch-marine pr-20">
		<h1 class="sr-only">{{ t("SearchPage.title") }}</h1>
		<div class="grid h-full grid-cols-[1fr_3fr]">
			<SearchForm
				query=""
				@submit="
					(values) => {
						onChangeSearchInput(values);
						searchstring = values.query;
					}
				"
			/>
			<div
				v-if="data != null"
				class="grid w-full grid-rows-[auto_1fr_auto] items-center bg-white p-8"
			>
				<div class="pt-9 font-semibold text-frisch-indigo">Suchergebnisse ({{ data.count }})</div>
				<DataTable :data="data.results" :results-total="data.count"></DataTable>
				<div class="flex justify-center p-8">
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
	</main>
</template>
