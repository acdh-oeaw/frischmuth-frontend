<script setup lang="ts">
export interface SearchFormData {
	search: string;
}

const props = defineProps<SearchFormData>();

const emit = defineEmits<{
	(event: "submit", values: SearchFormData): void;
}>();

function onSubmit(event: Event) {
	const element = event.currentTarget as HTMLFormElement;
	const formData = new FormData(element);

	emit("submit", {
		search: formData.get("q") as string,
	});
}

const searchLabelId = "search-field";
</script>

<template>
	<div class="grid grid-cols-[1fr_auto]">
		<div class="w-full bg-frisch-orange-searchform">
			<form
				class="grid size-full min-w-96 grid-rows-[auto_1fr] gap-8 px-6 py-14"
				role="search"
				@submit.prevent="onSubmit"
			>
				<div class="grid h-full grid-rows-[auto_1fr]">
					<div>
						<Input
							:id="searchLabelId"
							:default-value="props.search"
							name="q"
							placeholder="Suche"
							type="search"
						/>
					</div>

					<div class="flex justify-end">
						<Button type="submit" variant="searchform" size="searchform">suchen</Button>
					</div>
				</div>

				<div class="size-full bg-frisch-orange-super-light p-6">
					<SearchFilter />
				</div>
			</form>
		</div>
		<div
			class="size-0 border-y-[85px] border-l-[85px] border-y-transparent border-l-frisch-orange"
		/>
	</div>
</template>
