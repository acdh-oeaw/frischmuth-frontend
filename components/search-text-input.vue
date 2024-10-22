<script setup lang="ts">
const searchLabelId = "search-field";

const props = defineProps<{
	searchQuery: string;
}>();
</script>

<template>
	<div class="grid min-w-96 grid-rows-[auto_1fr] gap-8 px-6 pt-14">
		<div class="grid h-full grid-rows-[auto_1fr]">
			<div>
				<Input
					:id="searchLabelId"
					name="query"
					placeholder="Suche"
					type="search"
					:default-value="props.searchQuery"
				/>
				<SubmitButton />
			</div>
		</div>
	</div>
</template>
