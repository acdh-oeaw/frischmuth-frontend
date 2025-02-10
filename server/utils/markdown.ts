import { readdir } from "node:fs/promises";
import { join } from "node:path";

import toHtml from "rehype-stringify";
import withGfm from "remark-gfm";
import fromMarkdown from "remark-parse";
import toHast from "remark-rehype";
import { read } from "to-vfile";
import { unified } from "unified";
import { matter } from "vfile-matter";

const contentFolder = join(process.cwd(), "content");

const processor = unified().use(fromMarkdown).use(withGfm).use(toHast).use(toHtml);

type Metadata<T extends object> = T & {
	sections?: Array<{ title: string; content: string }>;
};

export interface ParsedMarkdown<T extends object> {
	body: string;
	sections: Array<{ title: string; content: string }>;
	metadata: T;
}

export async function processMarkdownFile<T extends object>(
	path: string,
): Promise<ParsedMarkdown<T>> {
	const filePath = join(contentFolder, path);
	const vfile = await read(filePath);

	matter(vfile, { strip: true });
	const { sections: _sections, ...metadata } = vfile.data.matter as Metadata<T>;

	const sections = [];

	if (_sections) {
		for (const section of _sections) {
			sections.push({
				title: section.title,
				content: String(await processor.process({ value: section.content })),
			});
		}
	}

	const body = String(vfile);

	return {
		metadata,
		sections,
		body,
	} as ParsedMarkdown<T>;
}

export async function processMarkdownFolder(path: string) {
	const folderPath = join(contentFolder, path);

	const items = [];

	for (const entry of await readdir(folderPath, { withFileTypes: true })) {
		if (!entry.isFile()) continue;

		items.push(await processMarkdownFile(join(path, entry.name)));
	}

	return items;
}
