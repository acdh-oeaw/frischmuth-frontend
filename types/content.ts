import type { MarkdownParsedContent } from "@nuxt/content";

export interface AboutPage extends MarkdownParsedContent {
	title: string;
	sections: Array<{
		title: string;
		content: string; // maybe MarkdownParsedContent
	}>;
}

export interface TeamMember extends MarkdownParsedContent {
	firstName?: string;
	lastName: string;
	image?: string;
}
