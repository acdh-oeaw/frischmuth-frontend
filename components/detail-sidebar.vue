<script lang="ts" setup>
import { EyeIcon } from "lucide-vue-next";

const props = defineProps<{
	source: {
		name?: string | undefined;
		alternative_name?: string | undefined;
		description?: string | undefined;
	};
	sourceType: string;
	isMobile: boolean;
}>();
</script>

<template>
	<div v-if="props.isMobile">
		<Drawer>
			<DrawerTrigger class="w-full">
				<EyeIcon class="text-frisch-orange" :size="16" />
			</DrawerTrigger>
			<DrawerContent>
				<div class="flex items-center gap-1 px-4 pt-2 text-sm">
					{{ props.sourceType }}
				</div>
				<h1 class="px-4 pb-2 text-lg font-semibold">{{ props.source.name }}</h1>
				<h2
					v-if="props.source.alternative_name"
					class="px-4 pb-2 font-normal text-muted-foreground"
				>
					{{ props.source.name }}
				</h2>
				<div class="px-4 py-2">
					<div class="py-2 text-base font-semibold text-black">Beschreibung</div>
					<div class="text-black">
						{{ props.source.description }}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	</div>
	<div v-else>
		<Sheet>
			<SheetTrigger as-child>
				<EyeIcon class="text-frisch-orange" :size="16" />
			</SheetTrigger>
			<SheetContent>
				<div class="flex items-center gap-1 text-sm">
					{{ props.sourceType }}
				</div>
				<SheetTitle class="pb-2">
					{{ props.source.name }}
					<h2
						v-if="props.source.alternative_name"
						class="px-4 pb-2 font-normal text-muted-foreground"
					>
						{{ props.source.name }}
					</h2></SheetTitle
				>
				<SheetDescription>
					<div class="py-2 text-base font-semibold text-black">Beschreibung</div>
					<div class="text-black">
						{{ props.source.description }}
					</div>
				</SheetDescription>
			</SheetContent>
		</Sheet>
	</div>
</template>
