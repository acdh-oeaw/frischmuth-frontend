<script lang="ts" setup>
import { SwatchBookIcon, XIcon } from "lucide-vue-next";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { TopicDetail } from "@/types/api";

import LoadingSpinner from "./ui/loading-spinner.vue";

const props = defineProps<{
	id?: number | null;
	relation: string;
	isMobile: boolean | undefined;
	isOpen: boolean;
}>();

const emit = defineEmits(["closeSideBar"]);

const isClosed = ref(false);
const route = useRoute();

const currentTopicId = computed(() => {
	if (route.query.topic != null) {
		return Number(route.query.topic);
	} else return null;
});

const { data, isPending } = useGetTopic({
	id: currentTopicId,
	isOpen: props.isOpen,
});

const isLoading = computed(() => isPending.value);
const topicDetail = computed(() => data.value as TopicDetail);

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
</script>

<template>
	<div v-if="props.isMobile && topicDetail != null">
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
				<div class="grid grid-cols-[auto_1fr] items-center gap-1 overflow-y-auto pt-2 text-sm">
					<SwatchBookIcon :size="16" />
					{{ relation }}
				</div>
				<div v-if="!isLoading && topicDetail != null">
					<div class="py-2">
						<h1 class="pb-2 text-lg font-semibold">{{ topicDetail.name }}</h1>
						<div
							v-if="
								(topicDetail.related_works != null && topicDetail.related_works.length > 0) ||
								topicDetail.description !== ''
							"
						>
							<div v-if="topicDetail.description !== ''">
								<h2 class="py-2 text-base font-semibold text-black">Beschreibung</h2>
								<div>
									{{ topicDetail.description }}
								</div>
							</div>
							<div
								v-if="
									topicDetail != null &&
									topicDetail.related_works != null &&
									topicDetail.related_works.length > 0
								"
							>
								<h2 class="py-2 text-base font-semibold text-black">Werkverweise</h2>
								<div v-for="link in topicDetail.related_works" :key="link.id">
									<NavLink
										class="flex cursor-pointer items-center gap-1 underline decoration-dotted hover:no-underline"
										:href="`/work/${link.id}`"
									>
										{{ link.title }}
									</NavLink>
								</div>
							</div>
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
				<div class="grid grid-cols-[auto_1fr] items-center gap-1 pt-2 text-sm">
					<SwatchBookIcon :size="16" />
					{{ relation }}
				</div>
				<div v-if="!isLoading && topicDetail != null">
					<h1 class="pb-2 text-lg font-semibold">{{ topicDetail.name }}</h1>
					<div
						v-if="
							(topicDetail.related_works != null && topicDetail.related_works.length > 0) ||
							topicDetail.description !== ''
						"
					>
						<div v-if="topicDetail.description !== ''">
							<div class="py-2 text-base font-semibold text-black">Beschreibung</div>
							<div>
								{{ topicDetail.description }}
							</div>
						</div>
						<div
							v-if="
								topicDetail != null &&
								topicDetail.related_works != null &&
								topicDetail.related_works.length > 0
							"
						>
							<h2 class="py-2 text-base font-semibold text-black">Werkverweise</h2>
							<div v-for="link in topicDetail.related_works" :key="link.id">
								<NavLink
									class="flex cursor-pointer items-center gap-1 pb-2 underline decoration-dotted hover:no-underline"
									:href="`/work/${link.id}`"
								>
									{{ link.title }}
								</NavLink>
							</div>
						</div>
					</div>
					<div v-else class="flex h-full align-middle text-sm text-neutral-500">
						Keine weiteren Informationen vorhanden.
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
