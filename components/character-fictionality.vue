<script setup lang="ts">
import { UserRoundIcon, UserRoundPenIcon, UsersRoundIcon, VenetianMaskIcon } from "lucide-vue-next";

const props = defineProps<{
	fictionality: string;
	isMobile?: boolean;
	isTablet?: boolean;
	isDetailView: boolean;
}>();

type Icon = typeof UserRoundIcon;

const characterIcons: Record<string, Icon> = {
	fiktivefigur: UserRoundPenIcon,
	historischefigur: UserRoundIcon,
	mythologischefigur: VenetianMaskIcon,
	metacharakter: UsersRoundIcon,
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
	<div v-if="!isDetailView">
		<div v-if="props.isMobile || props.isTablet">
			<Popover>
				<PopoverTrigger>
					<component
						:is="iconComponent"
						:class="
							props.fictionality === 'Metacharakter'
								? `inline text-frisch-indigo`
								: `inline text-frisch-orange`
						"
						:size="16"
					/>
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
						<component
							:is="iconComponent"
							:class="
								props.fictionality === 'Metacharakter'
									? `inline text-frisch-indigo`
									: `inline text-frisch-orange`
							"
							:size="16"
						/>
					</TooltipTrigger>
					<TooltipContent>
						<p>{{ props.fictionality }}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	</div>
	<div v-else>
		<div
			:class="
				props.fictionality === 'Metacharakter'
					? `inline-grid grid-cols-[auto_1fr] gap-1 bg-frisch-indigo text-white items-center text-xs px-2 py-1`
					: `inline-grid grid-cols-[auto_1fr] gap-1 bg-frisch-orange text-white items-center px-2 py-1 text-xs`
			"
		>
			<component :is="iconComponent" :size="16" />
			{{ props.fictionality }}
		</div>
	</div>
</template>
