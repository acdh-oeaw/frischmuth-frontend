import { useQuery } from "@tanstack/vue-query";

import type { CharacterResponse } from "@/types/api";

interface CharacterParams {
	id: ComputedRef<number | null>;
	metacharacterId: Ref<number | undefined | null>;
	isOpen: boolean;
}

export function useGetCharacterDetails(params: CharacterParams) {
	const { $api } = useNuxtApp();

	return useQuery({
		queryKey: ["character-info", params.id, params.metacharacterId] as const,
		async queryFn({ queryKey }) {
			const [, id, metacharacterId] = queryKey;
			if (!id) return null;

			const character = await $api["apis_api_apis_ontology.character_retrieve"]({
				params: { id },
			});

			// Only fetch metacharacter if metacharacterId is provided
			const metaCharacter = metacharacterId
				? await $api.api_metacharacter_detail_retrieve({
						params: { id: metacharacterId },
					})
				: null;

			const response: CharacterResponse = {
				name: character.fallback_name,
				description: character.description,
				fictionality: character.fictionality ? character.fictionality[0] : undefined,
				metacharacter: metaCharacter,
			};

			return response;
		},
		enabled: computed(() => {
			return params.isOpen || params.id.value != null;
		}),
	});
}
