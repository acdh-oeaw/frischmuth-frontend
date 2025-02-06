<script setup lang="ts">
import { UserRoundIcon, UserRoundPenIcon, VenetianMaskIcon } from "lucide-vue-next";

const props = defineProps<{
	fictionality: string;
	isMobile: boolean;
	isTablet: boolean;
}>();

type Icon = typeof UserRoundIcon;

const characterIcons: Record<string, Icon> = {
	fiktivefigur: UserRoundPenIcon,
	historischefigur: UserRoundIcon,
	mythologischefigur: VenetianMaskIcon,
};

const iconComponent = computed(() => {
	const normalizedFictionality = props.fictionality
		.toLowerCase()
		.replace(/[-\s,]/g, "") // Removes dashes, spaces, and commas
		.replace(/[^a-zA-Zäöüß]/g, ""); // Removes any non-alphabet characters except for umlauts and ß
	return characterIcons[normalizedFictionality] ?? null;
});
</script>

<template>
	<div v-if="props.isMobile || props.isTablet">
		<Popover>
			<PopoverTrigger>
				<component :is="iconComponent" class="inline text-frisch-orange" :size="16" />
			</PopoverTrigger>
			<PopoverContent>
				<p>{{ props.fictionality }}</p>
			</PopoverContent>
		</Popover>
	</div>
	<div v-else>
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger as-child>
					<component :is="iconComponent" class="inline text-frisch-orange" :size="16" />
				</TooltipTrigger>
				<TooltipContent>
					<p>{{ props.fictionality }}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</div>
</template>
