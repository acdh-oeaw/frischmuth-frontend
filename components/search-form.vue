<script setup lang="ts">
export interface SearchFormData {
	query: string;
	language: Array<string>;
	topic: Array<string>;
}

const emit = defineEmits<{
	(event: "submit", values: SearchFormData): void;
}>();

function onChange(event: Event) {
	const element = event.currentTarget as HTMLFormElement;
	const formData = new FormData(element);

	emit("submit", {
		query: formData.get("query") as string,
		language: formData.getAll("language") as Array<string>,
		topic: formData.getAll("topic") as Array<string>,
	});
}

// TODO: kill me
const containerHeight = ref(0);

onMounted(async () => {
	await nextTick();

	const searchForm = document.getElementById("search-container");
	if (searchForm != null) {
		containerHeight.value = searchForm.offsetHeight;
	}
});
</script>

<template>
	<div class="grid max-h-full grid-cols-[1fr_auto]">
		<div id="search-container" class="relative w-full bg-frisch-orange-searchform">
			<form role="search" @submit.stop.prevent="onChange" @submit.prevent="onChange">
				<div :style="{ height: containerHeight + 'px' }" class="overflow-y-auto">
					<slot />
				</div>
			</form>
		</div>
		<div
			class="size-0 border-y-[85px] border-l-[85px] border-y-transparent border-l-frisch-orange"
		/>
	</div>
</template>
