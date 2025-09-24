import type { ParsedMarkdown } from "@/server/utils/markdown";

export type StaticPage = ParsedMarkdown<{
	title: string;
}>;

export type TeamMember = ParsedMarkdown<{
	firstName?: string;
	lastName: string;
	image?: string;
}>;

export type BiographyEntry = ParsedMarkdown<{
	year: string;
	image?: string;
	alt?: string;
	imageTitle?: string;
	copyright?: string;
}>;

export type Quote = ParsedMarkdown<{
	title: string;
	link: string;
}>;

export type AltausseePlace = ParsedMarkdown<{
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
		authors: [{ surname: string; forename?: string; fallback_name?: string }];
		title: string;
		url: string;
	}>;
}>;

export type ExploreImages = ParsedMarkdown<{
	title: string;
	images: Array<{
		title: string;
		image: string;
		alt?: string;
		copyright?: string;
	}>;
}>;
