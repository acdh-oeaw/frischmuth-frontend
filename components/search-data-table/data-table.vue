<script setup lang="ts">
import { type ColumnDef, FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { SearchResults } from "@/types/api.ts";

const props = defineProps<{
	data: SearchResults["results"];
	resultsTotal: number;
}>();

const columns: Array<ColumnDef<SearchResults["results"][number]>> = [
	{
		accessorKey: "work_type",
		header: () => h("div", "Typ"),
		cell: ({ row }) => {
			const workType = row.getValue("work_type");
			return h("div", {}, workType.map((type) => type.name).join(", "));
		},
	},
	{
		accessorKey: "title",
		header: () => h("div", "Titel"),
		cell: ({ row }) => {
			return h("div", row.getValue("title"));
		},
	},
	{
		accessorKey: "expression_data",
		header: () => h("div", "Edition"),
		cell: ({ row }) => {
			const edition = row.getValue("expression_data");
			return h("div", {}, edition.map((type) => type.edition).join(", "));
		},
	},
	{
		accessorKey: "expression_data",
		header: () => h("div", "Ort"),
		cell: ({ row }) => {
			const placeOfPublication = row.getValue("expression_data");
			return h("div", {}, placeOfPublication.map((type) => type.place_of_publication).join(", "));
		},
	},
	{
		accessorKey: "expression_data",
		header: () => h("div", "Verlag"),
		cell: ({ row }) => {
			const publisher = row.getValue("expression_data");
			return h("div", {}, publisher.map((type) => type.publisher).join(", "));
		},
	},
	{
		accessorKey: "expression_data",
		header: () => h("div", "Veröffentlichungsdatum"),
		cell: ({ row }) => {
			const publicationDate = row.getValue("expression_data");
			return h("div", {}, publicationDate.map((type) => type.publication_date).join(", "));
		},
	},
];

const table = useVueTable({
	get data() {
		return props.data;
	},
	get columns() {
		return columns;
	},
	getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
	<div>
		<div class="rounded-md border">
			<Table>
				<TableHeader>
					<TableCaption class="sr-only">
						<span>Suchergebnisse</span>
					</TableCaption>
					<TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
						<TableHead v-for="header in headerGroup.headers" :key="header.id">
							<FlexRender
								v-if="!header.isPlaceholder"
								:render="header.column.columnDef.header"
								:props="header.getContext()"
							/>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<template v-if="table.getRowModel().rows?.length">
						<TableRow
							v-for="row in table.getRowModel().rows"
							:key="row.id"
							:data-state="row.getIsSelected() ? 'selected' : undefined"
						>
							<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
								<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
							</TableCell>
						</TableRow>
					</template>
					<template v-else>
						<TableRow>
							<TableCell :col-span="columns.length" class="h-24 text-center">
								Keine Einträge zu dieser Suche.
							</TableCell>
						</TableRow>
					</template>
				</TableBody>
			</Table>
		</div>
	</div>
</template>
