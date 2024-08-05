<script setup lang="ts">
export interface SearchFormData {
	query: string;
}

const emit = defineEmits<{
	(event: "submit", values: SearchFormData): void;
}>();

function onSubmit(event: Event) {
	const element = event.currentTarget as HTMLFormElement;
	const formData = new FormData(element);

	emit("submit", {
		query: formData.get("query") as string,
	});
}
</script>

<template>
	<div class="grid h-full grid-cols-[1fr_auto]">
		<div class="w-full bg-frisch-orange-searchform">
			<form
				id="search-form"
				role="search"
				@submit.prevent="onSubmit"
			>
				<slot />
			</form>
		</div>
		<div
			class="size-0 border-y-[85px] border-l-[85px] border-y-transparent border-l-frisch-orange"
		/>
	</div>
</template>
