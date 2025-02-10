import * as v from "valibot";

import { processMarkdownFile } from "@/server/utils/markdown";

const InputSchema = v.object({ path: v.pipe(v.string(), v.nonEmpty()) });

const cache = new Map<string, Awaited<ReturnType<typeof processMarkdownFile>>>();

export default defineEventHandler(async (event) => {
	const { path } = await readValidatedBody(event, (input) => v.parse(InputSchema, input));

	if (cache.has(path)) {
		return cache.get(path)!;
	}

	const result = await processMarkdownFile(path);

	cache.set(path, result);

	return result;
});
