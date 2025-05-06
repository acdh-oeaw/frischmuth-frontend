export interface Characters {
	main:
		| Array<{
				id: number | undefined;
				name: string | undefined;
				fictionality: string | undefined | null;
				metacharacterId: number | null;
		  }>
		| undefined;
	secondary:
		| Array<{
				id: number | undefined;
				name: string | undefined;
				fictionality: string | undefined | null;
				metacharacterId: number | null;
		  }>
		| undefined;
	spokenOf:
		| Array<{
				id: number | undefined;
				name: string | undefined;
				fictionality: string | undefined | null;
				metacharacterId: number | null;
		  }>
		| undefined;
}

export interface Place {
	id: number | undefined;
	name: string | undefined;
	longitude: number | null | undefined;
	latitude: number | null | undefined;
	description: string | undefined;
}

export interface Places {
	mentioned: Array<Place> | undefined;
	discussed: Array<Place> | undefined;
	takesPlaceIn: Array<Place> | undefined;
}

export interface RelatedWorkItem {
	id: number | string;
	title: string;
}

export interface RelatedWork {
	referencedIn?: Array<RelatedWorkItem>;
	references?: Array<RelatedWorkItem>;
	discussedIn?: Array<RelatedWorkItem>;
}
