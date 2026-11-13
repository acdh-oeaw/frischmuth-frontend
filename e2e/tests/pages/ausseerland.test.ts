import { expect, test } from "@/e2e/lib/test";
import { getWorkIdFromUrl } from "@/utils/work-url";

test("extracts work IDs from Ausseerland reference URLs", () => {
	for (const url of [
		"/work/26442",
		"work/26442",
		"https://barbarafrischmuth.com/work/26442",
		"https://frischmuth-dev.acdh-dev.oeaw.ac.at/apis/apis_ontology.work/update/26442",
	]) {
		expect(getWorkIdFromUrl(url)).toBe(26442);
	}

	expect(getWorkIdFromUrl("/work/invalid")).toBeUndefined();
	expect(getWorkIdFromUrl("https://example.com/other/26442")).toBeUndefined();
});
