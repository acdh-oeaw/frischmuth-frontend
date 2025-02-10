<script setup lang="ts">
export interface SearchFormData {
	query: string;
	startYear: number | undefined;
	endYear: number | undefined;
	workType: Array<string>;
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
		startYear: (formData.get("startYear") as unknown as number)
			? (formData.get("startYear") as unknown as number)
			: undefined,
		endYear: (formData.get("endYear") as unknown as number)
			? (formData.get("endYear") as unknown as number)
			: undefined,
		workType: formData.getAll("workType") as Array<string>,
		language: formData.getAll("language") as Array<string>,
		topic: formData.getAll("topic") as Array<string>,
	});
}
</script>

<template>
	<div class="relative flex h-full">
		<div class="absolute inset-0 w-full overflow-auto bg-frisch-orange-searchform">
			<form role="search" @submit.prevent="onChange" @submit.stop.prevent="onChange">
				<div class="overflow-y-auto">
					<slot />
				</div>
			</form>
		</div>
	</div>
</template>
