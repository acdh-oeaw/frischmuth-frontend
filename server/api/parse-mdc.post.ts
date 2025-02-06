import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import * as v from "valibot";

const InputSchema = v.object({ input: v.string() });

export default defineEventHandler(async (event) => {
	const env = useRuntimeConfig();
	const origin = getHeader(event, "origin");
	if (origin !== env.public.appBaseUrl) {
		throw createError({ status: 403 });
	}

	const { input } = await readValidatedBody(event, (input) => v.parse(InputSchema, input));

	const ast = await parseMarkdown(input);

	return ast;
});
