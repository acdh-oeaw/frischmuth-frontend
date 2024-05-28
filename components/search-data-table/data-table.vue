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
}>();

const columns: Array<ColumnDef<SearchResults["results"][number]>> = [
	{
		accessorKey: "title",
		header: () => h("div", "Titel"),
		cell: ({ row }) => {
			return h("div", row.getValue("title"));
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
	<div class="font-semibold text-frisch-indigo">Suchergebnisse ({{ table.getRowCount() }})</div>
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
</template>
