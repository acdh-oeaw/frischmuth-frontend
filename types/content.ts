import type { MarkdownParsedContent } from "@nuxt/content";

export interface SystemPage extends MarkdownParsedContent {
	title: string;
}

export interface TeamMember extends MarkdownParsedContent {
	firstName?: string;
	lastName: string;
	image?: string;
}
