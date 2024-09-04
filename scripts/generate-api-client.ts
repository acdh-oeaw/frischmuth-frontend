import { join } from "node:path";

import { createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { generateZodClientFromOpenAPI } from "openapi-zod-client";
import type { OpenAPIObject, PathsObject } from "openapi3-ts/oas30";
import { z } from "zod";

async function generate() {
	log.info("Generating api client.");

	const baseUrl = z.string().url().parse(process.env.NUXT_PUBLIC_API_BASE_URL);

	const outputFilePath = join(process.cwd(), "lib", "api.ts");

	const options = {
		url: createUrl({
			baseUrl,
			pathname: "/apis/swagger/schema",
			searchParams: createUrlSearchParams({ format: "json" }),
		}),
		prefixes: ["/api/work-detail/:id", "/api/work-preview"],
		dist: outputFilePath,
	};

	// download swagger file
	const data = (await request(options.url, { responseType: "json" })) as OpenAPIObject;

	// trim swagger file to only contain the prefixes specified in options.prefixes
	const prefixes = options.prefixes;
	let openApiDoc: OpenAPIObject = data;
	const paths: PathsObject = {};
	for (const [key, value] of Object.entries(openApiDoc.paths)) {
		if (prefixes.some((retain) => key.startsWith(retain))) {
			paths[key] = value;
		}
	}
	openApiDoc = {
		...openApiDoc,
		paths,
	};

	// use the trimmed openAPIDoc with openapi-zod-client
	await generateZodClientFromOpenAPI({
		openApiDoc,
		distPath: options.dist,
		options: {
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
