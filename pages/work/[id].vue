<script lang="ts" setup>
const route = useRoute();

const id = computed(() => {
	return Number(route.params.id as string);
});

const { data, isPending, isPlaceholderData } = useGetWork(
	computed(() => {
		return id.value;
	}),
);

const work = computed(() => {
	return data.value;
});

const isLoading = computed(() => {
	return isPending.value || isPlaceholderData.value;
});
</script>

<template>
	<MainContent class="relative grid h-full bg-frisch-marine py-8">
		<div v-if="!isLoading" class="grid h-full grid-cols-2 gap-4">
			{{ work }}
		</div>
		<Centered v-else class="pointer-events-none">
			<LoadingSpinner />
		</Centered>
	</MainContent>
</template>
