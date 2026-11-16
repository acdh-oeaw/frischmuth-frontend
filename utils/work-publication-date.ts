import type { WorkTypeData } from "@/types/api";

const fullDateWorkTypes = new Set([
	"anderweitige journalistische rezeption",
	"besprechung",
	"ankündigung",
	"porträt",
	"bericht",
	"vorabdruck",
	"rezension",
	"beitrag in periodikum",
]);

export function showsFullPublicationDate(workTypes: WorkTypeData = []) {
	return workTypes.some((type) => fullDateWorkTypes.has(type.name?.trim().toLowerCase() ?? ""));
}

export function formatWorkPublicationDate(
	date: string | null | undefined,
	workTypes: WorkTypeData = [],
) {
	if (!date) return "";
	const parts = date.split("-");
	if (!showsFullPublicationDate(workTypes)) return parts[0] ?? "";
	return parts.slice(0, 3).reverse().join(".");
}
