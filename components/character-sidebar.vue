<script lang="ts" setup>
import { UserRoundIcon, UsersRoundIcon, XIcon } from "lucide-vue-next";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { CharacterResponse } from "@/types/api";

import LoadingSpinner from "./ui/loading-spinner.vue";

const props = defineProps<{
	metaId?: number | null;
	isMobile: boolean | undefined;
	isOpen: boolean;
	fictionality: string;
}>();

const emit = defineEmits(["closeSideBar"]);

const isClosed = ref(false);
const route = useRoute();

const currentCharacterId = computed(() => {
	if (route.query.character != null) {
		return Number(route.query.character);
	} else return null;
});

const currentMetaId = ref<number | undefined | null>(null);

const { data, isPending } = useGetCharacterDetails({
	id: currentCharacterId,
	metacharacterId: currentMetaId,
	isOpen: props.isOpen,
});

const isLoading = computed(() => isPending.value);
const characterDetail = computed(() => (data.value ? (data.value as CharacterResponse) : null));

let timer: ReturnType<typeof setTimeout> | null = null;

function closeSidebar() {
	isClosed.value = true;
	timer = setTimeout(() => {
		emit("closeSideBar");
	}, 300);
}

onScopeDispose(() => {
	if (timer != null) {
		clearTimeout(timer);
	}
});

watch(
	() => {
		return props.isOpen;
	},
	() => {
		if (!props.isOpen) {
			isClosed.value = false;
		}
	},
	{ immediate: true },
);
watch(
	() => {
		return props.metaId;
	},
	() => {
		currentMetaId.value = props.metaId;
	},
	{ immediate: true },
);
</script>

<template>
	<div v-if="props.isMobile && characterDetail != null">
		<Drawer
			:open="isOpen"
			@update:open="
				(isOpen) => {
					if (!isOpen) {
						emit('closeSideBar');
					}
				}
			"
		>
			<DrawerContent class="px-4">
				<div
					class="grid grid-cols-[auto_1fr] items-center gap-1 overflow-y-auto pt-2 text-sm font-normal"
				>
					<UserRoundIcon :size="16" />
					{{ props.fictionality }}
				</div>
				<div v-if="!isLoading && characterDetail != null">
					<div class="py-2">
						<h1 class="pb-2 text-lg font-semibold">{{ characterDetail.name }}</h1>
						<div class="mb-1 inline-block bg-frisch-grey px-2 py-1 text-xs text-white opacity-85">
							{{ characterDetail.fictionality }}
						</div>
						<div
							v-if="
								characterDetail.description !== '' ||
								(characterDetail.uris != null && characterDetail.uris.length > 0)
							"
						>
							<div v-if="characterDetail.description !== ''">
								<h2 class="py-2 text-base font-semibold text-black">Beschreibung</h2>
								<div>
									{{ characterDetail.description }}
								</div>
							</div>
							<div>Weitere Informationen finden Sie hier: {{ characterDetail.uris }}</div>
						</div>
						<div v-else class="flex h-full align-middle text-sm text-neutral-500">
							Keine weiteren Informationen vorhanden.
						</div>
					</div>
				</div>
				<div v-else>
					<LoadingSpinner />
				</div>
			</DrawerContent>
		</Drawer>
	</div>
	<div v-else>
		<div
			class="3xl:w-1/6 fixed inset-y-0 right-0 z-50 h-full w-3/4 gap-4 overflow-y-auto border-l bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5"
			:data-state="isClosed ? 'closed' : 'open'"
		>
			<Button
				class="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
				size="icon"
				variant="transparent"
				@click="closeSidebar()"
			>
				<XIcon class="size-4" />
			</Button>
			<div>
				<div class="grid grid-cols-[auto_1fr] items-center gap-1 pt-2 text-sm font-normal">
					<UserRoundIcon :size="16" />
					{{ props.fictionality }}
				</div>
				<div v-if="!isLoading && characterDetail != null">
					<h1 class="pb-2 text-lg font-semibold">{{ characterDetail.name }}</h1>
					<div class="inline-grid grid-cols-[auto_1fr] gap-1">
						<CharacterFictionality
							:fictionality="characterDetail.fictionality ?? ''"
							:is-detail-view="true"
						/>
						<CharacterFictionality
							v-if="characterDetail.metacharacter != null"
							fictionality="Metacharakter"
							:is-detail-view="true"
						/>
					</div>
					<div
						v-if="
							characterDetail.description !== '' ||
							(characterDetail.uris != null && characterDetail.uris.length > 0)
						"
					>
						<div v-if="characterDetail.description !== ''">
							<h2 class="py-2 text-base font-semibold text-black">Beschreibung</h2>
							<div>
								{{ characterDetail.description }}
							</div>
						</div>
						<div
							v-if="characterDetail.uris != null && characterDetail.uris.length > 0"
							class="py-2"
						>
							<h2 class="font-semibold">Weitere Informationen finden Sie hier:</h2>
							<div v-for="(url, index) in characterDetail.uris" :key="index">
								<NavLink
									class="flex cursor-pointer items-center gap-1 hyphens-auto pt-1 underline decoration-dotted hover:no-underline"
									:href="url"
									target="_blank"
								>
									{{ url }}
								</NavLink>
							</div>
						</div>
					</div>
					<div v-else class="flex h-full pt-2 text-neutral-500" text-sm>
						Keine weiteren Informationen vorhanden.
					</div>
					<div v-if="characterDetail.metacharacter != null">
						<Separator class="my-5 h-0.5 bg-frisch-marine" />
						<div class="grid grid-cols-[auto_1fr] items-center gap-1 text-sm font-normal">
							<UsersRoundIcon :size="16" />
							{{ "Metacharakter" }}
						</div>
						<h1 class="pb-2 text-lg font-semibold">{{ characterDetail.metacharacter.name }}</h1>
						<div v-if="characterDetail.metacharacter.description !== ''">
							<div class="pt-2 text-base font-semibold text-black">Beschreibung</div>
							<div>
								{{ characterDetail.metacharacter.description }}
							</div>
						</div>
						<div
							v-if="
								characterDetail.metacharacter != null &&
								characterDetail.metacharacter.related_works != null &&
								characterDetail.metacharacter.related_works.length > 0
							"
						>
							<h2 class="py-2 text-base font-semibold text-black">Werkverweise</h2>
							<div v-for="link in characterDetail.metacharacter.related_works" :key="link.id">
								<NavLink
									class="flex cursor-pointer items-center gap-1 underline decoration-dotted hover:no-underline"
									:href="`/work/${link.id}`"
								>
									{{ link.title }}
								</NavLink>
							</div>
						</div>
						<div v-else class="flex h-full pt-2 align-middle text-sm text-neutral-500">
							Keine weiteren Informationen vorhanden.
						</div>
					</div>
				</div>
				<div v-else>
					<Centered>
						<LoadingSpinner />
					</Centered>
				</div>
			</div>
		</div>
	</div>
</template>
