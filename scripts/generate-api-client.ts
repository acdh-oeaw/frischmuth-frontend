import { join } from "node:path";

import { createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { generateZodClientFromOpenAPI } from "openapi-zod-client";
import type { OpenAPIObject } from "openapi3-ts/oas30";
import { z } from "zod";

async function generate() {
	log.info("Generating api client.");

	const baseUrl = z.string().url().parse(process.env.NUXT_PUBLIC_API_BASE_URL);

	const outputFilePath = join(process.cwd(), "lib", "api.ts");

	const url = createUrl({
		baseUrl,
		pathname: "/apis/swagger/schema",
		searchParams: createUrlSearchParams({ format: "json" }),
	});

	const openApiDoc = (await request(url, { responseType: "json" })) as OpenAPIObject;

	await generateZodClientFromOpenAPI({
		distPath: outputFilePath,
		openApiDoc,
		options: {
			shouldExportAllSchemas: true,
			shouldExportAllTypes: true,
			withAlias: true,
		},
	});
}

generate()
	.then(() => {
		log.success("Successfully generated api client.");
	})
	.catch((error: unknown) => {
		log.error("Failed to generate api client.\n", String(error));
	});
