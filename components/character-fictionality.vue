<script setup lang="ts">
import { UserRoundIcon, UserRoundPenIcon, VenetianMaskIcon } from "lucide-vue-next";

const props = defineProps<{
	fictionality: string;
	isMobile: boolean;
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
	<div v-if="props.isMobile">
		<Popover>
			<PopoverTrigger>
				<component :is="iconComponent" :size="16" class="inline text-frisch-orange" />
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
					<component :is="iconComponent" :size="16" class="inline text-frisch-orange" />
				</TooltipTrigger>
				<TooltipContent>
					<p>{{ props.fictionality }}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</div>
</template>
