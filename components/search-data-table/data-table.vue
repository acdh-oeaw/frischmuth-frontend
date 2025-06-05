<script lang="ts" setup>
import {
	type ColumnDef as TanStackColumnDef,
	FlexRender,
	getCoreRowModel,
	useVueTable,
} from "@tanstack/vue-table";

import NavLink from "@/components/nav-link.vue";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SearchResults } from "@/types/api.ts";

const props = defineProps<{
	data: SearchResults["results"];
	resultsTotal: number;
	isMobile: boolean;
}>();

type CustomColumnDef<T> = TanStackColumnDef<T> & {
	maxWidth?: boolean;
};

const columns: Array<CustomColumnDef<SearchResults["results"][number]>> = [
	{
		accessorKey: "work_type",
		header: () => h("div", "Typ"),
		cell: ({ row }) => {
			const workType = row.getValue("work_type");

			if (!Array.isArray(workType) || workType.length === 0) {
				return h("span", {}, "");
			}

			const firstWorkTypeName = workType[0]?.name;
			const IconComponent = firstWorkTypeName ? getWorkIcon(firstWorkTypeName) : null;

			const tooltipWrapper = h(TooltipProvider, {}, () => [
				h(Tooltip, {}, () => [
					h(TooltipTrigger, { class: "cursor-default" }, () => [
						IconComponent
							? h(IconComponent.icon, { class: "size-4 shrink-0" })
							: h("span", {}, workType.map((type) => type.name).join(", ")),
					]),
					h(TooltipContent, {}, () => workType.map((type) => type.name).join(", ")),
				]),
			]);

			const popOverWrapper = h(TooltipProvider, {}, () => [
				h(Popover, {}, () => [
					h(PopoverTrigger, { class: "cursor-default" }, () => [
						IconComponent
							? h(IconComponent.icon, { class: "size-4 shrink-0" })
							: h("span", {}, workType.map((type) => type.name).join(", ")),
					]),
					h(PopoverContent, {}, () => workType.map((type) => type.name).join(", ")),
				]),
			]);

			if (props.isMobile) {
				return h("span", {}, [
					popOverWrapper,
					h("div", { class: "sr-only" }, workType.map((type) => type.name).join(", ")),
				]);
			}

			return h("span", {}, [
				tooltipWrapper,
				h("div", { class: "sr-only" }, workType.map((type) => type.name).join(", ")),
			]);
		},
	},
	{
		accessorKey: "title",
		header: () => h("div", "Titel"),
		cell: ({ row }) => {
			return h(
				NavLink,
				{
					class:
						"underline decoration-dotted transition hover:no-underline focus-visible:no-underline",
					href: {
						path: row.original.id ? `/work/${row.original.id as unknown as string}` : "",
					},
				},
				row.getValue("title"),
			);
		},
		maxWidth: true, // Custom property
	},
	{
		accessorKey: "authors",
		header: () => h("div", "Autor"),
		cell: ({ row }) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const authors = row.getValue("authors") as Array<any> | undefined;
			return h(
				"div",
				{},
				authors
					?.map((author) => {
						return author.label;
					})
					.join(" / "),
			);
		},
	},
	{
		accessorKey: "expression_data",
		header: () => h("div", "Edition"),
		cell: ({ row }) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const edition = row.getValue("expression_data") as Array<any> | undefined;
			return h(
				"div",
				{},
				edition
					?.map((type) => {
						const edition = type.edition_type[0];
						if (edition != null) {
							return edition === "Referenzausgabe" ? "RA" : "EA";
						} else return type.edition_type;
					})
					.join(", "),
			);
		},
	},
	{
		accessorKey: "expression_data",
		header: () => h("div", "Verlag"),
		cell: ({ row }) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const publisher = row.getValue("expression_data") as Array<any> | undefined;
			return h("div", {}, publisher?.map((type) => type.publisher).join(", "));
		},
	},
	{
		accessorKey: "expression_data",
		header: () => h("div", "Veröffentlichungsdatum"),
		cell: ({ row }) => {
			const publicationData = row.getValue("expression_data");

			const publicationDates = Array.isArray(publicationData)
				? publicationData
						.map((type) => {
							const date = type.publication_date || "";
							const year = date.split("-")[0] || "";
							return year;
						})
						.join(", ")
				: "";

			return h("div", {}, publicationDates);
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

function getHeaderClass<T>(columnDef?: CustomColumnDef<T>): string {
	return columnDef?.maxWidth ? "max-w-xl" : "";
}

function getCellClass<T>(columnDef?: CustomColumnDef<T>): string {
	return columnDef?.maxWidth ? "max-w-xl" : "";
}
</script>

<template>
	<div>
		<div class="w-full overflow-x-hidden border">
			<Table>
				<TableHeader class="table-fixed">
					<TableCaption class="sr-only">
						<span>Suchergebnisse</span>
					</TableCaption>
					<TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
						<TableHead
							v-for="header in headerGroup.headers"
							:key="header.id"
							class="truncate p-2 text-left"
							:class="getHeaderClass(header.column.columnDef)"
						>
							<FlexRender
								v-if="!header.isPlaceholder"
								:props="header.getContext()"
								:render="header.column.columnDef.header"
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
							<TableCell
								v-for="cell in row.getVisibleCells()"
								:key="cell.id"
								class="truncate p-2"
								:class="getCellClass(cell.column.columnDef)"
							>
								<FlexRender :props="cell.getContext()" :render="cell.column.columnDef.cell" />
							</TableCell>
						</TableRow>
					</template>
					<template v-else>
						<TableRow>
							<TableCell class="h-24 text-center" :col-span="columns.length">
								Keine Einträge zu dieser Suche.
							</TableCell>
						</TableRow>
					</template>
				</TableBody>
			</Table>
		</div>
	</div>
</template>
