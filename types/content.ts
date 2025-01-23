import type { MarkdownParsedContent } from "@nuxt/content";

export interface StaticPage extends MarkdownParsedContent {
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

export interface BiographyEntry extends MarkdownParsedContent {
	year: string;
	image?: string;
	alt?: string;
	imageTitle?: string;
	copyright?: string;
}

export interface Quote extends MarkdownParsedContent {
	title: string;
	link: string;
}

export interface AltausseePlace {
	title: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
	description: string;
	images: Array<{
		title: string;
		image: string;
		alt?: string;
		copyright?: string;
	}>;
	links?: Array<{
		workTitle: string;
		url: string;
	}>;
}
