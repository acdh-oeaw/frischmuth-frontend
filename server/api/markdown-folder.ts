import * as v from "valibot";

import { processMarkdownFolder } from "@/server/utils/markdown";

const InputSchema = v.object({ path: v.pipe(v.string(), v.nonEmpty()) });

const cache = new Map<string, Awaited<ReturnType<typeof processMarkdownFolder>>>();

export default defineEventHandler(async (event) => {
	const { path } = await readValidatedBody(event, (input) => v.parse(InputSchema, input));

	if (cache.has(path)) {
		return cache.get(path)!;
	}

	const result = await processMarkdownFolder(path);

	cache.set(path, result);

	return result;
});
